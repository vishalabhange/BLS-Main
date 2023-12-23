import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Payments/PaymentsPage.css";
import companyLogo from "C:/Users/Vishal/Downloads/Merge-BS/src/images/default-2.jpg"; // Import your company logo image
import QuickAddPage from "../Product/QuickAdd";
// import html2pdf from "html2pdf.js";
import axios from "axios";

const PaymentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [serialNumber, setSerialNumber] = useState(1);
  const [GST, setGST] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  // const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [isGSTVisible, setGSTVisible] = useState(true);
  const [isNameInputVisible, setNameInputVisible] = useState(true);
  const [isAddressInputVisible, setAddressInputVisible] = useState(true);
  const gstRate = 9;
  const sgstRate = 9;

  const [vendorDetails, setVendorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the JWT token
    const authToken = getAuthToken();

    // Set up the headers with the JWT token
    const headers = {
      Authorization: `${authToken}`,
    };
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/Profile",
          { headers }
        );
        setVendorDetails(response.data.vendorDetails);
        setGST(response.data.vendorDetails.GSTNo);
        setCustomerName(response.data.vendorDetails.ShopName);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        setError("Error fetching vendor details");
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, []);

  const generateInvoiceNumber = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString().slice(-2);
    return `${day}${month}${year}${serialNumber.toString().padStart(4, "0")}`;
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  const handleProceed = () => {
    const billType = "bill1";
  
    const billData = {
      billType,
      customerName,
      address,
      total: totalIncludingGSTSGST.toFixed(2),
      products: itemsWithGST.map((item) => ({
        ProductName: item.ProductName,
        quantity: item.quantity,
        price: item.Price,
      })),
    };
  
    const authToken = getAuthToken();
    const headers = {
      Authorization: `${authToken}`,
    };
  
    axios
      .post("http://localhost:8000/api/invoices/invoices", billData, { headers })
      .then((response) => {
        console.log("Bill created successfully:", response.data);
        navigate("/pay")
      })
      .catch((error) => {
        console.error("Error creating bill:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
      });
  };

  const handleGST = () => {
    setNameInputVisible(false);
  };

  const handleGSTClick = () => {
    setNameInputVisible(true);
  };

  const handleCustomerNameEntered = () => {
    setNameInputVisible(false);
  };

  const handleAddressEntered = () => {
    setAddressInputVisible(false);
  };

  const handleCustomerNameClick = () => {
    setNameInputVisible(true);
  };

  const handleAddressClick = () => {
    setAddressInputVisible(true);
  };

  const calculateGST = (price, quantity, gstRate) => {
    return (price * quantity * gstRate) / 100;
  };

  const calculateSGST = (price, Quantity, sgstRate) => {
    return (price * Quantity * sgstRate) / 100;
  };

  const itemsWithGST = location.state.map((item) => {
    const gstCharge = calculateGST(item.Price, item.quantity, gstRate);
    const sgstCharge = calculateSGST(item.Price, item.quantity, sgstRate);

    return {
      ...item,
      gstCharge,
      sgstCharge,
    };
  });

  const gstTotal = itemsWithGST.reduce(
    (total, item) => total + item.gstCharge,
    0
  );

  const sgstTotal = itemsWithGST.reduce(
    (total, item) => total + item.sgstCharge,
    0
  );

  const totalIncludingGSTSGST = itemsWithGST.reduce(
    (total, item) => total + item.Price * item.quantity + gstTotal + sgstTotal,
    0
  );

  const addInvoiceToRecent = () => {
    const newInvoice = {
      invoiceDate: formatDate(new Date()),
      customerName: customerName,
      address: address,
      total: totalIncludingGSTSGST.toFixed(2),
      products: itemsWithGST.map((item) => ({
        ProductName: item.ProductName,
        quantity: item.quantity,
        price: item.price,
        total: (item.price * item.quantity).toFixed(2),
      })),
    };
    setRecentInvoices([...recentInvoices, newInvoice]);
  };

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <>
      <div className="page-layout">
        <div className="invoice">
          <div className="invoice-header">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="company-logo"
            />
            <div className="company-info">
              <h2>Company Name</h2>
              <p>Company Location</p>
              <p>Contact Number: (123) 456-7890</p>
            </div>
          </div>
          <div className="invoice-details">
            <div className="invoice-info">
              {/* <p>Invoice Number: {invoiceNumber}</p> */}
              <p>Invoice Date: {formatDate(new Date())}</p>
              <p className="invoice-recipient">
                {isGSTVisible ? (
                  <div>
                    <p>GST No:</p>
                    <input
                      type="String"
                      placeholder="Cust GST No.."
                      value={GST}
                      onChange={(e) => setGST(e.target.value)}
                      onBlur={handleGST}
                    />
                  </div>
                ) : (
                  <p onClick={handleGSTClick}>
                    Billed To: {customerName || "Click here to enter customer name"}
                  </p>
                )}
              </p>
            </div>
            <div className="invoice-recipient">
              {isNameInputVisible ? (
                <div>
                  <p>Billed To:</p>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={handleCustomerNameEntered}
                  />
                </div>
              ) : (
                <p onClick={handleCustomerNameClick}>
                  Billed To: {customerName || "Click here to enter customer name"}
                </p>
              )}
              {isAddressInputVisible ? (
                <div>
                  <p>Address:</p>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={handleAddressEntered}
                  />
                </div>
              ) : (
                <p onClick={handleAddressClick}>
                  Address: {address || "Click here to enter address"}
                </p>
              )}
            </div>
          </div>
          <div className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithGST.length > 0 ? (
                  itemsWithGST.map((item) => (
                    <tr key={item.id}>
                      <td>{item.ProductName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.Price}</td>
                      <td>₹{(item.Price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No items to display</td>
                  </tr>
                )}
                <tr className="gst-sgst-row">
                  <td colSpan="3">GST ({gstRate}%)</td>
                  <td>₹{gstTotal.toFixed(2)}</td>
                </tr>
                <tr className="gst-sgst-row">
                  <td colSpan="3">SGST ({sgstRate}%)</td>
                  <td>₹{sgstTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="invoice-total">
            <p>Total (Including GST and SGST): ₹{totalIncludingGSTSGST.toFixed(2)}</p>
          </div>
          <hr />
          <p>
            Thank you for choosing us for your products/services. We greatly
            appreciate your business. Please feel free to reach out to us for
            any inquiries or assistance. We look forward to serving you again in
            the future.
          </p>
          <hr />
          <h4>*Returns and Refunds:* Please not bargain on returns and refunds.</h4>
        </div>

        <div className="recent-invoices">
          <h2>Recent Invoices</h2>
          {recentInvoices.map((invoice, index) => (
            <div
              key={index}
              className="invoice-card"
              onClick={() => handleInvoiceClick(invoice)}
            >
              <div className="invoice-item">
                {/* <p className="invoice-number">InvoiceNo: #{invoice.invoiceNumber}</p> */}
                <p className="invoice-date">Date: {invoice.invoiceDate}</p>
              </div>
              <div className="invoice-item">
                <p className="customer-name">Customer: {invoice.customerName}</p>
              </div>
              <div className="invoice-item">
                <p className="customer-name">
                  Products: {invoice.products.map((product, idx) => (
                    <span key={idx}>{product.ProductName} ({product.quantity}) ({product.Price}), </span>
                  ))}
                </p>
              </div>
              <div className="invoice-item">
                <p className="total-amount">Total: ₹{invoice.total}</p>
              </div>
              <button className="Pay" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedInvoice && (
        <div className="invoice-details">
          <h2>Selected Invoice Details</h2>
          <p>Invoice Number: {selectedInvoice.invoiceNumber}</p>
          <p>Invoice Date: {selectedInvoice.invoiceDate}</p>
          <p>Customer: {selectedInvoice.customerName}</p>
          <p>Total: ₹{selectedInvoice.total}</p>
        </div>
      )}
      <button className="Pay" onClick={handleProceed}>
        Proceed
      </button>
      <button className="Pay" onClick={addInvoiceToRecent}>
        Add
      </button>
      <hr />
      <section className="QuickAdd">
        <QuickAddPage />
      </section>
    </>
  );
};

export default PaymentsPage;