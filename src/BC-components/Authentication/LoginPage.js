import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Authentication/loginPage.css";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { authtoken } = await response.json();

        // Save the token to local storage or state for future use
        localStorage.setItem('authToken', authtoken);

        props.showAlert("Successfully logged in", "success");

        // Redirect to the welcome page
        navigate('/Welcome');
      } else {
        // Handle login failure
        const data = await response.json();
        console.error(data.error);
        
        // You might want to show an error message to the user
        props.showAlert("Invalid Credentials", "Danger");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle other errors
    }
  };

  const handleAdmin = () => {
    navigate("/LandingPage");
  };

  return (
    <>
      <section className="container-forms">
        <div className="form login">
          <div className="form-content">
            <header>Login</header>
            <form onSubmit={handleLogin}>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bx bx-hide eye-icon"></i>
              </div>
              <div className="form-link">
                <a href="/ForgotPassword" className="forgot-pass">
                  Forgot password?
                </a>
              </div>
              <div className="field button-field">
                <button type="submit">Login</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                Don't have an account?{" "}
                <a href="/signup" className="link signup-link">
                  Signup
                </a>
              </span>
            </div>
          </div>
          <div className="line"></div>
          <div className="media-options">
            <a href="/phone" className="field facebook">
              <i className="bx bxl-facebook facebook-icon"></i>
              <span>Login with Phone No</span>
            </a>
          </div>
        </div>
      </section>
      <button className="field button-field cart" onClick={handleAdmin}>
        Admin-Login 
      </button>
    </>
  );
};

export default LoginPage;