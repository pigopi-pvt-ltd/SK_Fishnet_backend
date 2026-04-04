import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    // SAAS FIELD
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    phone: { type: String, required: true },
    gstin: { type: String, default: '' },
    address: { type: String, default: '' },
    
    transactions: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['Purchase (Material Received)', 'Payment Made'], required: true },
        amount: { type: Number, required: true }, 
        itemsDescription: { type: String }, 
        paymentMode: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI', 'N/A'], default: 'N/A' },
        note: { type: String }
    }],

    totalOutstanding: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model('Vendor', vendorSchema);