import invoicesController from '../controllers/Invoices.mjs';
import express from 'express';
const router = express.Router();


// import verifyToken from '../middleware.mjs'; // Import your authentication middleware.




// Example route definition
router.get('/invoices', invoicesController.getInvoices);
router.post('/invoices', invoicesController.createInvoice);

export default router;
