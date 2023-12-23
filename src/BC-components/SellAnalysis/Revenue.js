import React, { useState, useEffect } from "react";
import axios from "axios";
import "../SellAnalysis/Revenue.css";

const Revenue = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  useEffect(() => {
    const authToken = getAuthToken();

    const headers = {
      Authorization: `${authToken}`,
    };

    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/invoices/invoices",
          { headers }
        );
        setInvoices(response.data.invoices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setError("Error fetching invoices");
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const fetchInvoiceItems = async (MainInvoiceID) => {
    try {
      const authToken = getAuthToken();

      const headers = {
        Authorization: `${authToken}`,
      };
      const response = await axios.get(
        `http://localhost:8000/api/invoices/invoicesitem/${MainInvoiceID}`,
        { headers }
      );
      setInvoiceItems(response.data.invoiceItems);
    } catch (error) {
      console.error("Error fetching invoice items:", error);
      setError("Error fetching invoice items");
    }
  };

  const handleInvoiceClick = async (invoice) => {
    setSelectedInvoice(invoice);
    console.log("Selected Invoice ID:", invoice.MainInvoiceID);
    fetchInvoiceItems(invoice.MainInvoiceID);
  };
  

  return (
    <>
      <h2>Invoice History</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="HistoryList">
        <ol>
          {invoices.map((invoice) => (
            <li
              key={invoice.MainInvoiceID}
              onClick={() => handleInvoiceClick(invoice)}
            >
              Invoice Number: {invoice.MainInvoiceID || "N/A"}, Date:{" "}
              {invoice.DatePurchased || "N/A"}, Customer Name:{" "}
              {invoice.Customer || "N/A"}

              {/* Display detailed information below the selected invoice in the list */}
              {selectedInvoice && selectedInvoice.MainInvoiceID === invoice.MainInvoiceID && (
                <div className="DetailedInvoiceInfo">
                  <h3>Selected Invoice Details</h3>
                  <p>Invoice Number: {selectedInvoice.MainInvoiceID}</p>
                  <p>Invoice Date: {selectedInvoice.DatePurchased || "N/A"}</p>
                  <p>Customer Name: {selectedInvoice.Customer || "N/A"}</p>

                  {/* Display detailed invoice items in a table */}
                  <table>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item) => (
                        <tr key={item.ProductName}>
                          <td>{item.ProductName}</td>
                          <td>{item.Quantity}</td>
                          <td>{item.UnitPrice}</td>
                          <td>{item.SubTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default Revenue;