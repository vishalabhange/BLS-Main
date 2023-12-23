import React, { useState } from 'react';
import '../Authentication/ProfilePage.css'; // Import your CSS file for styling

const ProfilePage = () => {
  // State variables
  const [fullName, setFullName] = useState('Tatya Vinchu');
  const [email, setEmail] = useState('Billings@example.com');
  const [bio, setBio] = useState('Billings');
  const [avatar, setAvatar] = useState('path/to/avatar.jpg');
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle profile updates (e.g., make an API request)
    // For demonstration purposes, simply logging the updated profile details
    console.log('Updated Profile:', { fullName, email, bio, avatar });
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Example usage
  const createVendor = async (vendorDetails) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/Profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed, e.g., authorization token
        },
        body: JSON.stringify({ vendorDetails }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating vendor:', errorData.error);
      } else {
        const createdVendor = await response.json();
        console.log('Vendor created successfully:', createdVendor);
      }
    } catch (error) {
      console.error('Error creating vendor:', error.message);
    }
  };

  // Example usage
  const newVendorDetails = {
    VendorID: 123,
    Name: 'Vendor Name',
    Address: 'Vendor Address',
    ShopName: 'Vendor Shop',
    Location: 'Vendor Location',
    PinCode: '123456',
    ContactNo: '1234567890',
    GSTNo: 'ABC123',
    email: 'vendor@example.com',
  };

  createVendor(newVendorDetails);

  return (
    <div className="profile-container">
      <div className="profile-header">
        {avatar && typeof avatar === 'string' ? (
          <img src={avatar} alt="Profile Avatar" className="avatar" />
        ) : (
          <div className="avatar-placeholder">Placeholder or Default Avatar</div>
        )}
        <h2>{fullName}</h2>
        <p>{email}</p>
      </div>

      <div className="profile-details">
        <h3>About Me</h3>
        <p>{bio}</p>
      </div>

      <div className="profile-edit">
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>

          <label>Avatar URL:</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />

          {/* File input for uploading profile picture */}
          <label>Upload Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
