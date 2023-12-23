import React, { useState } from "react";
import { useNavigate, Routes, Route, Redirect } from "react-router-dom";
import Landing from "./Landing.js";


//----------------------------- BC-components --------------------------------------------|

import SignupPage from "../src/BC-components/Authentication/SignupPage.js";
// import Navbar from "./BC-components/Navbar";
import ShoppingCartPage from "../src/BC-components/Other/ShoppingCartPage.js";
import LoginPage from "../src/BC-components/Authentication/LoginPage.js";
import PaymentsPage from "../src/BC-components/Payments/PaymentsPage.js";
import Pay from "../src/BC-components/Payments/Pay.js";
import SearchPage from "./BC-components/Bars/SearchPage.js";
import AddItemsPage from "./BC-components/Product/AddItemsPage.js";
import CreateBillPage from "./BC-components/Payments/CreateBillPage.js";
import Code from "./Code";
import Revenue from "./BC-components/SellAnalysis/Revenue.js";
import Welcome from "./BC-components/Other/WelcomePage.js";
import Succeed from "./BC-components/Other/Succeed.js";
import ForgotPassword from "./BC-components/Authentication/ForgotPassword.js";
import ProfilePage from "./BC-components/Authentication/ProfilePage.js";


//-------------------------- BB-components*/} ---------------------------------------------|

import LandingPage from "./BB-components/Home/LandingPage.js";
import Home from "./BB-components/Home/Home.js";
import AddExtra from "./BB-components/Inventory/AddExtra";
import Inventory from "./BB-components/Inventory/Inventory.js";
// import Navbar from "./BB-components/Navbar.js";
import Selling from "./BB-components/Sellings/Selling.js";
import SellingStats from "./BB-components/Sellings/SellingStats.js";
import TransactionDetails from "./BB-components/Transactions/TransactionDetails.js";
import TransactionHistory from "./BB-components/Transactions/TransactionHistory.js";
import Subscription from "./BB-components/Renew/Subscription.js";
import Payments from "./BB-components/Payments/Payment1.js";
import SearchBar from "./BB-components/Bars/SearchBar.js";
import Users from "./BB-components/Other/Users.js";
import Alert from "./BC-components/Other/Alert.js";


const App = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [cart, setCart] = useState([]); // Initialize cart as an empty array
  const addToCart = (item) => {
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemIndex === -1) {
      setCart([...cart, { ...item, quantity: 1 }]);
    } else {
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
    }
  };

  const removeFromCart = (item) => {
    // Implement your removeFromCart logic here
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  const [alert, setAlert] = useState(null)
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }


  return (
    <>
      {/* <Navbar /> */}
      {/* <Alert alert={alert}/> */}
      <Routes>
        {/* Landing */}
        <Route exact path="/Landing" element={<Landing />} />

        {/* -----------------------  BC-routing  --------------------------- */}

        <Route exact path="/" element={<LoginPage showAlert={showAlert} />} />
        <Route path="/signup" element={<SignupPage showAlert={showAlert} />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/Welcome"
          element={isAuthenticated ? <Welcome /> : <navigate to="/" />}
        />
        <Route
          path="/Succeed"
          element={isAuthenticated ? <Succeed /> : <navigate to="/" />}
        />
        <Route path="/ProfilePage" element={isAuthenticated ? <ProfilePage /> : <navigate to="/" />} />
        <Route
          path="/items"
          element={
            isAuthenticated ? <ShoppingCartPage /> : <navigate to="/" />
          }
        />
        <Route
          path="/Additems"
          element=
             { isAuthenticated ? <AddItemsPage addToCart={addToCart} /> : navigate('/') } />
        <Route
          path="/cart"
          element={
            isAuthenticated ? (
              <PaymentsPage removeFromCart={removeFromCart} />
            ) : (
              <navigate to="/" />
            )
          }
        />
        <Route
          path="/bill"
          element={
            isAuthenticated ? <CreateBillPage /> : <navigate to="/" />
          }
        />
        <Route
          path="/search"
          element={isAuthenticated ? <SearchPage /> : <navigate to="/" />}
        />
        <Route
          path="/code"
          element={isAuthenticated ? <Code /> : <navigate to="/" />}
        />
        <Route
          path="/Pay"
          element={isAuthenticated ? <Pay /> : <navigate to="/" />}
        />
        <Route
          path="/Revenue"
          element={isAuthenticated ? <Revenue /> : <navigate to="/" />}
        />


        {/* -----------------------------  BB-routings  ---------------------------- */}
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route
          exact
          path="/Home"
          element={isAuthenticated ? <Home /> : <navigate to="/" />}
        />
        <Route
          exact
          path="/SellingStats"
          element={
            isAuthenticated ? <SellingStats /> : <navigate to="/" />
          }
        />
        <Route
          exact
          path="/TransactionHistory"
          element={
            isAuthenticated ? <TransactionHistory /> : <navigate to="/" />
          }
        />
        <Route
          exact
          path="/TransactionDetails"
          element={
            isAuthenticated ? <TransactionDetails /> : <navigate to="/" />
          }
        />
        <Route
          path="/AddExtra"
          element={isAuthenticated ? <AddExtra /> : <navigate to="/" />}
        />
        <Route
          path="/Subscription"
          element={
            isAuthenticated ? <Subscription /> : <navigate to="/" />
          }
        />
        <Route
          path="/Payment"
          element={isAuthenticated ? <Payments /> : <navigate to="/" />}
        />
        <Route
          path="/Inventory"
          element={isAuthenticated ? <Inventory /> : <navigate to="/" />}
        />
        <Route
          path="/SearchBar"
          element={isAuthenticated ? <SearchBar /> : <navigate to="/" />}
        />
        <Route
          path="/Users"
          element={<Users />}
        />
      </Routes>
    </>
  );
};

export default App;
