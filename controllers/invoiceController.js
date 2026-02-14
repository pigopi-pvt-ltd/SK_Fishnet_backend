const Invoice = require('../models/InvoiceModel');

const createInvoice = async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const savedInvoice = await newInvoice.save();
        
        console.log(`New Invoice Generated: ${savedInvoice.invoiceNumber}`);
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};


const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};


const cancelInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id, 
            { status: 'Cancelled' }, 
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        console.log(`Invoice Cancelled: ${id}`);
        res.json({ message: 'Invoice Cancelled Successfully', invoice: updatedInvoice });
    } catch (error) {
        console.error('Error cancelling invoice:', error);
        res.status(500).json({ error: 'Failed to cancel invoice' });
    }
};


const getLastInvoiceNumber = async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });

        let nextNum = 1;
        if (lastInvoice && lastInvoice.invoiceNumber) {
            // Ensure we parse it as integer to avoid string concatenation issues
            nextNum = parseInt(lastInvoice.invoiceNumber, 10) + 1;
        }

        // Format to 3 digits (e.g., 001, 005, 012)
        const formattedNumber = String(nextNum).padStart(3, '0');
        res.json({ nextInvoiceNumber: formattedNumber });
    } catch (error) {
        console.error('Error fetching last number:', error);
        res.json({ nextInvoiceNumber: '001' }); // Fallback
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    cancelInvoice,
    getLastInvoiceNumber
};