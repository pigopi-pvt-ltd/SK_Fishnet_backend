const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' },
    date: { type: Date, default: Date.now },
    taxType: { type: String, enum: ['Local', 'Interstate'], default: 'Local' },
    customerDetails: {
        name: { type: String },
        address: { type: String },
        gstin: { type: String },
        stateCode: { type: String }
    },
    transportDetails: {
        vehicleNumber: { type: String }
    },
    items: [
        {
            desc: { type: String },
            hsn: { type: String },
            qty: { type: Number, default: 0 },
            price: { type: Number, default: 0 },
            gstRate: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        }
    ],
    taxDetails: {
        taxableAmount: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        igst: { type: Number, default: 0 }, 
        totalAmount: { type: Number, default: 0 }
    },
    amountInWords: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);