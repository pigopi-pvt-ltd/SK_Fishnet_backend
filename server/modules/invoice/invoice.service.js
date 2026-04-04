import Invoice from './invoice.model.js';

// 1. Create Invoice
export const createInvoice = async (invoiceData, businessId) => {
    // Add businessId to the invoice data before saving
    const newInvoice = new Invoice({ ...invoiceData, businessId });
    return await newInvoice.save();
};

// 2. Get All Invoices (Isolated for specific business)
export const getInvoices = async (businessId) => {
    // Only fetch invoices that belong to this specific business
    return await Invoice.find({ businessId }).sort({ createdAt: -1 });
};

// 3. Cancel Invoice
export const cancelInvoice = async (id, businessId) => {
    // SECURITY CHECK: Ensure the invoice being cancelled belongs to the requesting business
    const updatedInvoice = await Invoice.findOneAndUpdate(
        { _id: id, businessId: businessId }, 
        { status: 'Cancelled' }, 
        { new: true }
    );

    if (!updatedInvoice) {
        throw new Error('Invoice not found or unauthorized access'); 
    }
    
    return updatedInvoice;
};

// 4. Calculate Next Invoice Number (Per Business)
export const getNextInvoiceNumber = async (businessId) => {
    // Find the last invoice ONLY for this specific business
    const lastInvoice = await Invoice.findOne({ businessId }).sort({ createdAt: -1 });

    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
        nextNum = parseInt(lastInvoice.invoiceNumber, 10) + 1;
    }

    return String(nextNum).padStart(3, '0');
};