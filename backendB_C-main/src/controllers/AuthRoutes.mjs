import express from 'express';
import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../DBConnecton.mjs'; 
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import verifyToken from '../middleware.mjs'; 
// Assuming pool is the default export in connection.js
// import { OAuth2Client } from 'google-auth-library';

const router = Router();
const JWT_SECRET = 'YourSecretKey'; // Change this to your secret key

const LOGIN = {

login : async (req, res) => {
    // Implementation for login route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const [vendors] = await pool.query('SELECT VendorID, email, password FROM vendors WHERE email = ?', [email]);

      if (vendors.length === 0) {
        return res.status(400).json({ error: 'Please login with correct credentials' });
      }

      const passwordCompare = await bcrypt.compare(password, vendors[0].password);

      if (!passwordCompare) {
        return res.status(400).json({ error: 'Please login with correct credentials' });
      }
      const data = {
        vendors: {
          VendorID: vendors[0].VendorID,
          email: vendors[0].email,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },


  signup : async (req, res) => {
    // Implementation for signup route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email,ContactNo,ShopName, password} = req.body;

      // Check if the user with the same email already exists
      const [existingUser] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Sorry, user already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the users table
      await pool.query('INSERT INTO vendors (name, email,ContactNo,ShopName, password) VALUES (?, ?, ?,?,?)', [
        name,
        email,
        ContactNo,
        ShopName,
        hashedPassword,
      ]);

      // Create a JWT token
      const data = {
        user: {
          email,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

       res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred');
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Generate a unique reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Save the reset token and its expiration time in the database
      const resetExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour
      await pool.query('UPDATE vendors SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?', [
        resetToken,
        resetExpiration,
        email,
      ]);

      // Send an email to the user with a link containing the reset token
      // Include the link in the email template
      const resetLink = `http://localhost:8000/api/auth/resetpassword/${resetToken}`;
       const emailBody = `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`;
       const emailSubject = 'Password Reset Request';
 
       // Replace 'user.email' with the actual email address of the user
       await sendEmail(email, emailSubject, emailBody);

      res.json({ message: 'Password reset link sent to your email address.' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },

  resetPassword: async (req, res) => {
    try {
      const resetToken = req.params.Name;
      const { newPassword } = req.body;

      // Check if the token is valid and not expired
      const [user] = await pool.query('SELECT * FROM vendors WHERE resetToken = ? AND resetTokenExpiration > ?', [
        resetToken,
        new Date(),
      ]);

      if (user.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token.' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password and reset the resetToken fields
      await pool.query('UPDATE vendors SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE resetToken = ?', [
        hashedPassword,
        resetToken,
      ]);

      res.json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },
 updateProfile : async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      verifyToken(req, res, async () => {
        const { VendorID } = req.user;
  
        try {
          const { name, email, contactNo, shopName, password } = req.body;
  
          // Check if the user with the given VendorID exists
          const [existingUser] = await pool.query('SELECT * FROM vendors WHERE vendorid = ?', [VendorID]);
  
          if (existingUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
  
          // Hash the password if provided
          let hashedPassword = existingUser[0].password; // Use the existing hashed password by default
  
          if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
          }
  
          // Update the user profile in the vendors table
          await pool.query(
            'UPDATE vendors SET name=?, email=?, ContactNo=?, ShopName=?, password=? WHERE VendorID=?',
            [name, email, contactNo, shopName, hashedPassword, VendorID]
          );
  
          res.json({ message: 'Profile updated successfully' });
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Some error occurred during profile update');
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred');
    }
  },

  getProfileCallback : async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        try {
          const { VendorID } = req.user;
  
          // Fetch specific vendor details from the database based on VendorID
          const [vendorDetails] = await pool.query(
            'SELECT VendorID, Name, Address, ShopName, Location, PinCode, ContactNo, GSTNo, email FROM vendors WHERE VendorID = ?',
            [VendorID]
          );
  
          if (vendorDetails.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
          }
  
          res.json({ vendorDetails: vendorDetails[0] });
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Some error occurred while fetching vendor details');
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred');
    }
  },



// const CLIENT_ID = '862605739224-kk9isaqbnds5tkbq0s8va79sv4ir7c7a.apps.googleusercontent.com'; // Your Google Client ID


// Route: Sign up or Authenticate with Google: POST "/api/auth/google"
// router.post('/google', async (req, res) => {
//   try {
//     const { idtoken } = req.body;
//     const ticket = await client.verifyIdToken({
//       idToken: idtoken,
//       audience: CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const email = payload.email;

//     // Check if the user with the provided email exists
//     const [user] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);

//     if (user.length === 0) {
//       // If the user doesn't exist, you can create a new user with the provided emailb
//       // This is where you should insert the new user into your database
//       const hashedPassword = ''; // You should hash the password, or use a different authentication method

//       // For example:
//       await pool.query('INSERT INTO vendors (email, password) VALUES (?, ?)', [email, hashedPassword]);

//       // Then, create a JWT token for the new user
//     }

//     // Create a JWT token
//     const data = {
//       user: {
//         email: email,
//       },
//     };
//     const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });

//     res.json({ authtoken });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal server error');
//   }
// })

};

// Function to send an email
const sendEmail = async (to, subject, html) => {
  try {
    // Create a nodemailer transporter using your email service provider's settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port : 587,
      secure: false,
      auth: {
        user: 'abhangevishal2002@gmail.com',
        pass: 'tozaozhecudzbxmg',
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'abhangevishal2002@gmail.com',
      to,
      subject,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
export default LOGIN;