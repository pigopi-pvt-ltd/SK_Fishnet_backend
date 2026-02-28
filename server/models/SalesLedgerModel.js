const mongoose = require('mongoose');

// For only those sales/inventory who dont have pakka bill or inovoice
const salesLedgerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    itemsDescription: { type: String, required: true }, // what product/item given
    totalAmount: { type: Number, required: true }, // cost of item
    amountReceived: { type: Number, default: 0 }, // how much money got
    note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SalesLedger', salesLedgerSchema);