import { Router } from 'express';
import pool from '../DBConnecton.mjs';
import verifyToken from '../middleware.mjs';

const invoicesController = {

  generateInvoiceID: (date) => {
    // Validate date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date object');
    }

    // Get the components of the date
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Combine the components into a numeric value
    // Note: This assumes that each component does not exceed its respective range
    const numericValue = year * 10000000000 + month * 100000000 + day * 1000000 + hours * 10000 + minutes * 100 + seconds;

    // Ensure the numeric value is within the range of an unsigned 32-bit integer
    const invoiceID = numericValue % 4294967296;

    return invoiceID;
  },


  createInvoice : async (req, res) => {
    verifyToken(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error verifying token' });
      }
  
      try {
        const { VendorID } = req.user;
        const { products, customerName, address, total, payment_method } = req.body;  // Updated to match frontend data structure
  
        const mainInvoiceID = invoicesController.generateInvoiceID(new Date());
  
        const mainInvoiceInsertQuery = 'INSERT INTO main_invoices (MainInvoiceID, TotalAmount, PaymentStatus, DatePurchased, VendorID, Customer, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)';  // Updated query
  
        const mainInvoiceValues = [mainInvoiceID, total, 'Paid', new Date(), VendorID, customerName, payment_method];  // Updated to match frontend data structure
  
        const [mainInvoiceResults] = await pool.query(mainInvoiceInsertQuery, mainInvoiceValues);
  
        if (mainInvoiceResults.affectedRows > 0) {
          const itemInvoiceValues = products.map((product) => [
            mainInvoiceID,
            product.ProductName,
            product.quantity,
            product.price,
            product.total,  // Updated to match frontend data structure
          ]);
  
          const itemInvoiceInsertQuery = 'INSERT INTO invoice_items (MainInvoiceID, ProductName, Quantity, UnitPrice, SubTotal) VALUES ?';
  
          const [itemInvoiceResults] = await pool.query(itemInvoiceInsertQuery, [itemInvoiceValues]);
  
          if (itemInvoiceResults.affectedRows > 0) {
            return res.status(201).json({ message: 'Invoice created successfully' });
          } else {
            return res.status(400).json({ error: 'Failed to create item invoice' });
          }
        } else {
          return res.status(400).json({ error: 'Failed to create main invoice' });
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
        return res.status(500).json({ error: 'Error creating invoice' });
      }
    });
  },

  getInvoices: async (req, res) => {
    verifyToken(req, res, async (err) => {
      if (err) {
        res.status(500).json({ error: 'Error verifying token' });
        return;
      }

      try {
        const { VendorID } = req.user;

        const getInvoicesQuery = 'SELECT * FROM main_invoices WHERE VendorID = ?';

        const [invoicesResults] = await pool.query(getInvoicesQuery, [VendorID]);

        res.status(200).json({ invoices: invoicesResults });
      } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Error fetching invoices' });
      }
    });
  },

  getInvoiceItems : async (req, res) => {
    try {
      const MainInvoiceID = req.params.Name; // Updated: use req.params.MainInvoiceID directly
      console.log(MainInvoiceID);

      const getInvoiceItemsQuery = `
        SELECT
          MainInvoiceID,
          ProductName,
          Quantity,
          UnitPrice,
          SubTotal
        FROM
          invoice_items
        WHERE
          MainInvoiceID = ?`;

      const [invoiceItemsResults] = await pool.query(getInvoiceItemsQuery, [MainInvoiceID]);

      return res.status(200).json({ invoiceItems: invoiceItemsResults });
    } catch (error) {
      console.error('Error fetching invoice items:', error);
      return res.status(500).json({ error: 'Error fetching invoice items' });
    }
  }


};


export default invoicesController;
