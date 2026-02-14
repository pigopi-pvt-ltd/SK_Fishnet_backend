const express = require('express');
const router = express.Router();
const { 
    createInvoice, 
    getInvoices, 
    cancelInvoice, 
    getLastInvoiceNumber 
} = require('../controllers/invoiceController');

// Currently present routes
router.post('/', createInvoice);
router.get('/', getInvoices);
router.delete('/:id', cancelInvoice);
router.get('/last-number', getLastInvoiceNumber);

module.exports = router;