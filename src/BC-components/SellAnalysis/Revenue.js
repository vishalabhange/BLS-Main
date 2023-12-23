import React, { useState, useEffect } from "react";
import axios from "axios";
import "../SellAnalysis/Revenue.css";

const Revenue = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  useEffect(() => {
    const authToken = getAuthToken();

    const headers = {
      Authorization: `${authToken}`, // Assuming the token type is "Bearer"
    };

    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/invoices/invoices",
          { headers }
        );
        console.log(response.data); // Log the data to the console
        setInvoices(response.data.invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <>
      <h2>Invoice History</h2>
      <div className="HistoryList">
        <ul>
          {invoices.map((invoice) => (
            <li
              key={invoice.MainInvoiceID}
              onClick={() => handleInvoiceClick(invoice)}
            >
              Invoice Number: {invoice.MainInvoiceID || "N/A"}, Date:{" "}
              {invoice.DatePurchased || "N/A"}, Customer Name:{" "}
              {invoice.VendorID || "N/A"}
            </li>
          ))}
        </ul>

        {/* Detailed information of the selected invoice */}
        {selectedInvoice && (
          <div className="HistoryListItem">
            <h3>Selected Invoice Details</h3>
            <p>Invoice Number: {selectedInvoice.MainInvoiceID || "N/A"}</p>
            <p>Invoice Date: {selectedInvoice.DatePurchased || "N/A"}</p>
            <p>Customer Name: {selectedInvoice.VendorID || "N/A"}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </>
  );
};

export default Revenue;
