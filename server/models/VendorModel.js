const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    // Vendor/Wholesaler Details
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    phone: { type: String, required: true },
    gstin: { type: String, default: '' },
    address: { type: String, default: '' },
    
    // Ledger: History of saaman aaya (Purchase) aur paisa diya (Payment)
    transactions: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['Purchase (Material Received)', 'Payment Made'], required: true },
        amount: { type: Number, required: true }, // Kitne ka saaman tha ya kitna paisa diya
        itemsDescription: { type: String }, // Kya saaman aaya (optional for payments)
        paymentMode: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI', 'N/A'], default: 'N/A' },
        note: { type: String }
    }],

    // Kitna paisa dena baaki hai (Positive means Admin owes money to Vendor)
    totalOutstanding: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);