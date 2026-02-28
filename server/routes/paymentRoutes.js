const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Vendor Routes
router.get('/vendors', paymentController.getAllVendors);
router.post('/vendors', paymentController.createVendor);
router.get('/vendors/:id', paymentController.getVendorById);
router.post('/vendors/:id/transaction', paymentController.addVendorTransaction);

// Sales Ledger Routes
router.get('/sales-ledger', paymentController.getCombinedSalesLedger);
router.post('/sales-ledger/manual', paymentController.addManualSale);

module.exports = router;