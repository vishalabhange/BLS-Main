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

  // const addToCart = (item) => {
  //   axios
  //     .post("http://localhost:8000/api/AddToCart", { item }) // Adjust the endpoint accordingly
  //     .then((response) => {
  //       // Handle the success response, if needed
  //       console.log("Item added to the cart:", response.data);
  //     })
  //     .catch((error) => {
  //       // Handle the error
  //       console.error("Error adding item to the cart:", error);
  //     });
  // };

  const [serialNumber, setSerialNumber] = useState(1);

  // State variables to track customer name, invoice number, address, and serial number
  const [GST, setGST] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [ProductName, setProductName] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());

  // State variables to manage the visibility of input fields
  const [isGSTVisible, setGSTVisible] = useState(true);
  const [isNameInputVisible, setNameInputVisible] = useState(true);
  const [isAddressInputVisible, setAddressInputVisible] = useState(true);

  // GST and SGST rates (adjust these rates based on your requirements)
  const gstRate = 9; // Example: 9% GST
  const sgstRate = 9; // Example: 9% SGST

  // Function to generate a new invoice number
  function generateInvoiceNumber() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString().slice(-2); // Extract last two digits of the year
    return `${day}${month}${year}${serialNumber.toString().padStart(4, "0")}`;
  }

  // Format the date as "dd/mm/yy"
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Extract last two digits of the year
    return `${day}/${month}/${year}`;
  };

  // Handler for the "Proceed" button
  // const handleProceed = () => {
  //   const newInvoiceNumber = generateInvoiceNumber();
  //   const invoiceAmountToPass = totalIncludingGSTSGST || 0;
  //   // navigate("/pay", {
  //   navigate("/pay", {
  //     state: {
  //       invoiceNumber: newInvoiceNumber,
  //       invoiceDate: formatDate(new Date()),
  //       customerName: customerName,
  //       address: address,
  //       invoiceAmount: invoiceAmountToPass,
  //     },
  //   });
  // };


  const getAuthToken = () => {
    const authToken = localStorage.getItem("authToken");
    return authToken;
  };

  const handleProceed = () => {
    const billType = "bill1"; // or "bill2", etc.
  
    const billData = {
      billType,
      customerName,
      address,
      total: totalIncludingGSTSGST.toFixed(2),
      products: itemsWithGST.map((item) => ({
        ProductName: item.ProductName,  // Make sure ProductName is correctly assigned
        quantity: item.quantity,
        price: item.Price,
      })),
    };
  
    // Get the JWT token
  const authToken = getAuthToken();

  // Set up the headers with the JWT token
  const headers = {
    Authorization: `${authToken}`,
  };
  
    axios
      .post("http://localhost:8000/api/invoices/invoices", billData, { headers })
      .then((response) => {
        console.log("Bill created successfully:", response.data);
        // You may navigate or perform other actions based on the response
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
    setNameInputVisible(false); // Hide the name input field
  };

  const handleGSTClick = () => {
    setNameInputVisible(true); // Hide the name input field
  };

  // Handler for when the user enters the customer's name
  const handleCustomerNameEntered = () => {
    setNameInputVisible(false); // Hide the name input field
  };

  // Handler for when the user enters the address
  const handleAddressEntered = () => {
    setAddressInputVisible(false); // Hide the address input field
  };

  // Handler for clicking the displayed customer name
  const handleCustomerNameClick = () => {
    setNameInputVisible(true); // Show the name input field again
  };

  // Handler for clicking the displayed address
  const handleAddressClick = () => {
    setAddressInputVisible(true); // Show the address input field again
  };

  // Function to calculate GST charge for an item
  const calculateGST = (price, quantity, gstRate) => {
    return (price * quantity * gstRate) / 100;
  };

  // Function to calculate SGST charge for an item
  const calculateSGST = (price, Quantity, sgstRate) => {
    return (price * Quantity * sgstRate) / 100;
  };

  // Calculate the GST and SGST charges for each item
  const itemsWithGST = location.state.map((item) => {
    const gstCharge = calculateGST(item.Price, item.quantity, gstRate);
    const sgstCharge = calculateSGST(item.Price, item.quantity, sgstRate);

    return {
      ...item,
      gstCharge,
      sgstCharge,
    };
  });

  // Calculate the total including GST and SGST charges

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

  // State variable to store added invoices
  const [recentInvoices, setRecentInvoices] = useState([]);

  // Function to add an invoice to the "Recent Invoices" section
  const addInvoiceToRecent = () => {
    const pdfContent = document.querySelector(".invoice");

    // Set the options for pdf generation
    // const options = {
    //   margin: 10,
    //   filename: "invoice.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    // };

    // html2pdf()
    //   .from(pdfContent)
    //   .set(options)
    //   .outputPdf((pdf) => {
    //     // Download the generated PDF
    //     const blob = pdf.output("blob");
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = options.filename;
    //     a.click();
    //     URL.revokeObjectURL(url);
    //   });

    const newInvoice = {
      invoiceNumber: invoiceNumber,
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

    // Add the new invoice to the list of recent invoices
    setRecentInvoices([...recentInvoices, newInvoice]);
  };

  // State variable to store the selected invoice to display in the invoice section
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Function to set the selected invoice when it's clicked
  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  // const handlePassInvoiceAmount = () => {
  //   const invoiceAmountToPass = totalIncludingGSTSGST || 0;
  //   navigate("/pay", { state: { invoiceAmount: invoiceAmountToPass } });
  // };

  return (
    <>
      <div className="page-layout">
        <div className="invoice">
          {/* {selectedInvoice ? ( */}
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
              <p>Invoice Number: {invoiceNumber}</p>
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
                    Billed To:{" "}
                    {customerName || "Click here to enter customer name"}
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
                  Billed To:{" "}
                  {customerName || "Click here to enter customer name"}
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
            <p>
              Total (Including GST and SGST): ₹
              {totalIncludingGSTSGST.toFixed(2)}
            </p>
          </div>
          {/* <button onClick={handlePassInvoiceAmount}>Pass Invoice Amount to Another Page</button> */}
          <hr />
          <p>
            Thank you for choosing us for your products/services. We greatly
            appreciate your business. Please feel free to reach out to us for
            any inquiries or assistance. We look forward to serving you again in
            the future.
          </p>
          <hr />
          <h4>
            **Returns and Refunds:** Please not bargain on returns and refunds.
          </h4>
        </div>

        <div className="recent-invoices">
          <h2>Recent Invoices</h2>
          {recentInvoices.map((invoice, index) => (
            <div
              key={index}
              className="invoice-card"
              onClick={() => handleInvoiceClick(invoice)} // Set the selected invoice when clicked
            >
              <div className="invoice-item">
                <p className="invoice-number">
                  InvoiceNo: #{invoice.invoiceNumber}
                </p>
                <p className="invoice-date">Date: {invoice.invoiceDate}</p>
              </div>
              <div className="invoice-item">
                <p className="customer-name">
                  Customer: {invoice.customerName}
                </p>
              </div>
              <div className="invoice-item">
                <p className="customer-name">
                  Products:{" "}
                  {invoice.products.map((product, idx) => (
                    <span key={idx}>
                      {product.ProductName} ({product.quantity}) ({product.Price}),{" "}
                    </span>
                  ))}
                </p>
              </div>
              <div className="invoice-item">
                <p className="total-amount">Total: ₹{invoice.total}</p>
              </div>
              <button className="Pay" onClick={handleProceed}>
                Proceed
              </button>
              {/* onClick={handleProceed}  */}
            </div>
          ))}
        </div>
      </div>

      {/* Conditional rendering of the selected invoice in the invoice section */}
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
