import Vendor from './vendor.model.js';
import SalesLedger from './salesLedger.model.js';
import Invoice from '../invoice/invoice.model.js';

// ==========================================
// 1. VENDOR / INWARD PURCHASES LOGIC
// ==========================================

export const getAllVendors = async (businessId) => {
    return await Vendor.find({ businessId }).sort({ createdAt: -1 });
};

export const getVendorById = async (id, businessId) => {
    const vendor = await Vendor.findOne({ _id: id, businessId });
    if (!vendor) throw new Error('Vendor not found or unauthorized');
    return vendor;
};

export const createVendor = async (vendorData, businessId) => {
    const newVendor = new Vendor({ ...vendorData, businessId });
    return await newVendor.save();
};

export const addVendorTransaction = async (id, transactionData, businessId) => {
    const { type, amount, itemsDescription, paymentMode, note, date } = transactionData;
    const vendor = await Vendor.findOne({ _id: id, businessId });
    
    if (!vendor) throw new Error('Vendor not found or unauthorized');

    const newTxn = { type, amount: Number(amount), itemsDescription, paymentMode, note, date: date || new Date() };
    vendor.transactions.push(newTxn);

    // Khata Logic
    if (type === 'Purchase (Material Received)') {
        vendor.totalOutstanding += Number(amount);
    } else if (type === 'Payment Made') {
        vendor.totalOutstanding -= Number(amount);
    }

    return await vendor.save();
};

// ==========================================
// 2. OUTWARD / SALES INVENTORY LOGIC
// ==========================================

export const getCombinedSalesLedger = async (businessId) => {
    // 1. Get all Active Invoices for this business
    const invoices = await Invoice.find({ status: 'Active', businessId });
    
    // Map Invoices
    const formattedInvoices = invoices.map(inv => ({
        _id: inv._id,
        source: 'Invoice',
        date: inv.date,
        partyName: inv.customerDetails.name || 'Unknown',
        description: inv.items.map(item => `${item.desc} (Qty: ${item.qty})`).join(', '),
        totalAmount: inv.taxDetails.totalAmount,
        amountReceived: inv.taxDetails.totalAmount, 
        invoiceNumber: inv.invoiceNumber
    }));

    // 2. Get all Manual (Non-Invoice) Sales for this business
    const manualSales = await SalesLedger.find({ businessId });
    
    // Map Manual Sales
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

    // 3. Combine and sort
    return [...formattedInvoices, ...formattedManualSales].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const addManualSale = async (saleData, businessId) => {
    const newSale = new SalesLedger({ ...saleData, businessId });
    return await newSale.save();
};