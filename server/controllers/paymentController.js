const Vendor = require('../models/VendorModel');
const SalesLedger = require('../models/SalesLedgerModel');
const Invoice = require('../models/InvoiceModel');

// ==========================================
// 1. VENDOR / INWARD PURCHASES LOGIC
// ==========================================

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendor' });
    }
};

exports.createVendor = async (req, res) => {
    try {
        const newVendor = new Vendor(req.body);
        const savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor' });
    }
};

exports.addVendorTransaction = async (req, res) => {
    try {
        const { type, amount, itemsDescription, paymentMode, note, date } = req.body;
        const vendor = await Vendor.findById(req.params.id);
        
        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

        const newTxn = { type, amount: Number(amount), itemsDescription, paymentMode, note, date: date || new Date() };
        vendor.transactions.push(newTxn);

        // Khata Logic:
        // Purchase (Maal aaya) -> Udhar badhega (+)
        // Payment Made (Paisa diya) -> Udhar ghatega (-)
        if (type === 'Purchase (Material Received)') {
            vendor.totalOutstanding += Number(amount);
        } else if (type === 'Payment Made') {
            vendor.totalOutstanding -= Number(amount);
        }

        const savedVendor = await vendor.save();
        res.status(200).json(savedVendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vendor transaction' });
    }
};

// ==========================================
// 2. OUTWARD / SALES INVENTORY LOGIC
// ==========================================

// This API merges Formal Invoices and Non-Invoice manual sales
exports.getCombinedSalesLedger = async (req, res) => {
    try {
        // 1. Get all Active Invoices
        const invoices = await Invoice.find({ status: 'Active' });
        
        // Map Invoices to standard format
        const formattedInvoices = invoices.map(inv => ({
            _id: inv._id,
            source: 'Invoice',
            date: inv.date,
            partyName: inv.customerDetails.name || 'Unknown',
            description: inv.items.map(item => `${item.desc} (Qty: ${item.qty})`).join(', '),
            totalAmount: inv.taxDetails.totalAmount,
            amountReceived: inv.taxDetails.totalAmount, // Assuming invoices are fully paid, can be modified later
            invoiceNumber: inv.invoiceNumber
        }));

        // 2. Get all Manual (Non-Invoice) Sales
        const manualSales = await SalesLedger.find();
        
        const formattedManualSales = manualSales.map(sale => ({
            _id: sale._id,
            source: 'Manual (No Invoice)',
            date: sale.date,
            partyName: sale.customerName,
            description: sale.itemsDescription,
            totalAmount: sale.totalAmount,
            amountReceived: sale.amountReceived,
            invoiceNumber: 'N/A'
        }));

        // 3. Combine and sort by date (newest first)
        const combinedLedger = [...formattedInvoices, ...formattedManualSales].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(combinedLedger);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales ledger' });
    }
};

exports.addManualSale = async (req, res) => {
    try {
        const newSale = new SalesLedger(req.body);
        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add manual sale' });
    }
};