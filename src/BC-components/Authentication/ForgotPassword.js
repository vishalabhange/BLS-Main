import React, { useState } from 'react';
import '../Authentication/ForgotPassword.css'; // Import your CSS file for styling

const ForgotPassword = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle the password reset request
    // For demonstration purposes, simply displaying a success message
    setMessage(`A password reset link has been sent to ${email}`);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Your Password?</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      
      <form className='ForgotForm' onSubmit={handleSubmit}>
        <label className='ForgotLabel'>Email:</label>
        <input
        className='ForgotInput'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className='ForgotBtn' type="submit">Reset Password</button>
      </form>

      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ForgotPassword;
