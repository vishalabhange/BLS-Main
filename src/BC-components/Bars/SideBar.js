import React, { useState } from "react";
import "../Bars/SideBar.css";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the auth token from local storage
    localStorage.removeItem("authToken");

    // Redirect to the login page or any other desired page
    navigate("/");
  };


  return (
    <div class="Sidebar-container">
      <div class="sidebar">
        <div class="user-account"></div>
        <ul class="links">
          <h4>Main Menu</h4>
          <li>
            <span className="material-icons-outlined">dashboard</span>
            <a href="/ProfilePage">Dashboard</a>
          </li>
          <li>
            <span className="material-icons-outlined">show_chart</span>
            <a href="/Revenue">Revenue</a>
          </li>
          {/* <li>
            <span className="material-icons-outlined">flag</span>
            <a href="#">Reports</a>
          </li> */}
          <hr className="SideBarHr" />
          <h4>Advanced</h4>
          <li>
            <span className="material-icons-outlined">person</span>
            <a href="#">Designer</a>
          </li>
          <li>
            <span className="material-icons-outlined">group</span>
            <a href="/Inventory">Developer</a>
          </li>
          <hr className="SideBarHr" />
          <h4>Account</h4>
          {/* <li>
            <span className="material-icons-outlined">bar_chart</span>
            <a href="#">Overview</a>
          </li> */}
          <li>
            <span className="material-icons-outlined">mail</span>
            <a href="#">Help</a>
          </li>
          <li>
            <span className="material-icons-outlined">settings</span>
            <a href="#">Settings</a>
          </li>
          <li class="logout" onClick={handleLogout}>
            <span className="material-icons-outlined">logout</span>
            <a >Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
