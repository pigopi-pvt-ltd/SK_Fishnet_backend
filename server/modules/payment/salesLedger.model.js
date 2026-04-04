import mongoose from 'mongoose';

const salesLedgerSchema = new mongoose.Schema({
    // SAAS FIELD
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    
    customerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    itemsDescription: { type: String, required: true }, 
    totalAmount: { type: Number, required: true }, 
    amountReceived: { type: Number, default: 0 }, 
    note: { type: String }
}, { timestamps: true });

export default mongoose.model('SalesLedger', salesLedgerSchema);