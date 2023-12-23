// AddProductForm.js
import React, { useState } from "react";
import axios from "axios";
import "../Inventory/inventory.css"; // Import your CSS file
import Navbar from "../Bars/Navbar";
import SideBar from "C:/Users/Vishal/Downloads/Merge-BS/src/BC-components/Bars/SideBar.js";

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(""); // Change default value to an empty string
  const [quantity, setQuantity] = useState(""); // Change default value to an empty string

  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  const handleAddProduct = async () => {
    const authToken = getAuthToken();

    const headers = {
      Authorization: `${authToken}`,
    };

    try {
      await axios.post("http://localhost:8000/api/queries/Items", {
        productName,
        price,
        quantity,
      }, { headers });
      alert("Product added successfully!");
      // You can add additional logic like clearing the form fields after submission
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="SideBar">
        <SideBar />
      </div>
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <label>
        Product Name:
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <button className="add-product-btn" onClick={handleAddProduct}>
        Add Product
      </button>
    </div>
    </>
  );
};

export default AddProductForm;
