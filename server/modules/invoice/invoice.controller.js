import * as invoiceService from './invoice.service.js';

// 1. Create Invoice
const createInvoice = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedInvoice = await invoiceService.createInvoice(req.body, businessId);
        console.log(`New Invoice Generated: ${savedInvoice.invoiceNumber} for Business: ${businessId}`);
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};

// 2. Get All Invoices
const getInvoices = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const invoices = await invoiceService.getInvoices(businessId);
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

// 3. Cancel Invoice
const cancelInvoice = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const updatedInvoice = await invoiceService.cancelInvoice(req.params.id, businessId);
        res.json({ message: 'Invoice Cancelled Successfully', invoice: updatedInvoice });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error cancelling invoice:', error);
        res.status(500).json({ error: 'Failed to cancel invoice' });
    }
};

// 4. Get Last Invoice Number (Next Number)
const getLastInvoiceNumber = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const nextInvoiceNumber = await invoiceService.getNextInvoiceNumber(businessId);
        res.json({ nextInvoiceNumber });
    } catch (error) {
        console.error('Error fetching last number:', error);
        res.json({ nextInvoiceNumber: '001' }); 
    }
};

export {
    createInvoice,
    getInvoices,
    cancelInvoice,
    getLastInvoiceNumber
};