import * as paymentService from './payment.service.js';

// ==========================================
// 1. VENDOR / INWARD PURCHASES LOGIC
// ==========================================

const getAllVendors = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const vendors = await paymentService.getAllVendors(businessId);
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

const getVendorById = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const vendor = await paymentService.getVendorById(req.params.id, businessId);
        res.status(200).json(vendor);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to fetch vendor' });
    }
};

const createVendor = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedVendor = await paymentService.createVendor(req.body, businessId);
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor' });
    }
};

const addVendorTransaction = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedVendor = await paymentService.addVendorTransaction(req.params.id, req.body, businessId);
        res.status(200).json(savedVendor);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add vendor transaction' });
    }
};

// ==========================================
// 2. OUTWARD / SALES INVENTORY LOGIC
// ==========================================

const getCombinedSalesLedger = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const combinedLedger = await paymentService.getCombinedSalesLedger(businessId);
        res.status(200).json(combinedLedger);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales ledger' });
    }
};

const addManualSale = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedSale = await paymentService.addManualSale(req.body, businessId);
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add manual sale' });
    }
};

export {
    getAllVendors,
    getVendorById,
    createVendor,
    addVendorTransaction,
    getCombinedSalesLedger,
    addManualSale
};