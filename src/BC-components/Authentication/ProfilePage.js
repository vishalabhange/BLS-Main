import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "C:/Users/Vishal/Downloads/Merge-BS/src/images/default-2.jpg";
import "../Authentication/ProfilePage.css";
// import SideBar from "../Bars/SideBar";

const ProfilePage = () => {
  // const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  // Fetch profile data from the API endpoint
  useEffect(() => {
    // Get the JWT token
    const authToken = getAuthToken();

    // Set up the headers with the JWT token
    const headers = {
      Authorization: `${authToken}`,
    };

    axios
      .get("http://localhost:8000/api/auth/Profile", { headers })
      .then((response) => {
        // Ensure that response.data.vendorDetails is an object
        if (typeof response.data.vendorDetails === "object") {
          setProfileData(response.data.vendorDetails); // Set profile data to the vendorDetails object
        } else {
          console.error("Invalid data received from the profile API");
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data: " + error);
      });
  }, []);

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // const navigateToAnotherPage = () => {
  //   const nameParam = encodeURIComponent(profileData?.Name);
  //   navigate(`/Welcome?name=${nameParam}`);
  // };
  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If a file is selected, perform the file upload
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      console.log(formData);

      try {
        const authToken = getAuthToken();
        const headers = {
          Authorization: `${authToken}`,
          "Content-Type": "multipart/form-data",
        };

        // Upload the file and get the updated avatar URL
        const response = await axios.post(
          "http://localhost:8000/api/auth/Profile",
          formData,
          { headers }
        );

        // Update the profileData state with the new avatar URL
        setProfileData((prevProfileData) => ({
          ...prevProfileData,
          avatar: response.data.avatarUrl,
        }));

        // Update the profile image link in the database
        await axios.post(
          "http://localhost:8000/api/auth/Profile",
          { profileImg: response.data.avatarUrl },
          { headers }
        );

        // Handle the response as needed
        console.log("File uploaded successfully:", response.data);
        // After uploading, navigate to another page
        // navigateToAnotherPage();

      } catch (error) {
        console.error("Error uploading file:", error.message);
      }
    }

  };

  return (
    <div className="profile-page">
      {/* <div className="shopping-sidenav">
          <SideBar />
        </div> */}
      <div className="profile-header">
        <img
          src={profileData?.avatar || defaultAvatar}
          alt="Profile Avatar"
          className="avatar"
        />
        <div className="profile-details">
          <h2>{profileData?.Name}</h2>
          <p>ID: {profileData?.VendorID}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* File input for uploading profile picture */}
        <label htmlFor="avatarInput">Upload Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          onChange={handleFileChange}
        />

        <button type="submit">Save Changes</button>
      </form>

      {profileData && (
        <div className="profile-info">
          <h3>Contact Information</h3>
          <p>Email: {profileData.email}</p>
          <p>Phone No: {profileData.ContactNo}</p>
        </div>
      )}

      {profileData && (
        <div className="profile-address">
          <h3>Shop Details</h3>
          <p>Shop: {profileData.ShopName}</p>
          <p>
            Address: {profileData.Address}, {profileData.PinCode}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
