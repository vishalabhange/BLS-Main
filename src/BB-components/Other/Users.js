import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddItemsPage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

//   const getAuthToken = () => {
//     const authToken = localStorage.getItem("authToken");
//     return authToken;
//   };

  // Fetch profile data from the API endpoint
  useEffect(() => {
    // const authToken = getAuthToken();

    // const headers = {
    //   Authorization: `${authToken}`,
    // };

    axios
      .get("http://localhost:8000/api/auth/Profile")
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

  return (
    <>
      <div className="itemlist-page">
        <div className="shopping-sidenav">
          {/* You can render profile data here if needed */}
          {profileData && (
            <div>
              <h2>Profile Details</h2>
              <p>Name: {profileData.Name}</p>
              <p>Email: {profileData.email}</p>
              {/* Add other profile details as needed */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddItemsPage;
