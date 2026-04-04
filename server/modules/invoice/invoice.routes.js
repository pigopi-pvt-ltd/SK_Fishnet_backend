import express from 'express';
import { 
    createInvoice, 
    getInvoices, 
    cancelInvoice, 
    getLastInvoiceNumber 
} from './invoice.controller.js';

const router = express.Router();

// Currently present routes
router.post('/', createInvoice);
router.get('/', getInvoices);
router.delete('/:id', cancelInvoice);
router.get('/last-number', getLastInvoiceNumber);

export default router;