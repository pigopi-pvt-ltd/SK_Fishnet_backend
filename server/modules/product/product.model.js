import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    // SAAS FIELD
    businessId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Business', 
        required: true 
    },
    // Removed 'unique: true' from here. Uniqueness is now handled by the index below.
    name: { type: String, required: true }, 
    hsn: { type: String, required: true }, 
    rate: { type: Number, required: true }, 
    price: { type: Number, default: 0 } 
}, { timestamps: true });

// ==========================================
// SAAS COMPOUND INDEX (Crucial for Multi-Tenancy)
// ==========================================
// This ensures that "Paracetamol" can be added by Hospital A and Hospital B,
// but Hospital A cannot add "Paracetamol" twice.
productSchema.index({ name: 1, businessId: 1 }, { unique: true });

export default mongoose.model('Product', productSchema);