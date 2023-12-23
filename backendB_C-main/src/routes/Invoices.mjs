import invoicesController from '../controllers/Invoices.mjs';
import verifyToken from '../middleware.mjs'; // Import your authentication middleware.
import express from 'express';
const router = express.Router();


// import verifyToken from '../middleware.mjs'; // Import your authentication middleware.



// Example route definition
router.get('/invoices', invoicesController.getInvoices);
router.get('/invoices', verifyToken,invoicesController.getInvoices);
router.get('/invoicesitem/:Name',verifyToken, invoicesController.getInvoiceItems);
router.post('/invoices', invoicesController.createInvoice);

export default router;