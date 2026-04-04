import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    // Basic Business Details
    name: { type: String, required: true },
    email: { type: String }, // Contact email for the business
    
    // SaaS Specific: What type of business is this?
    industry: { 
        type: String, 
        enum: ['None', 'Hospital', 'Clothing', 'Grocery', 'Mall', 'Jewellery', 'Hotel', 'Tent House', 'Home Care', 'Education'], 
        default: 'None' 
    },
    
    // Address & Taxation
    address: { type: String, default: '' },
    gstin: { type: String, default: '' },
    
    // Customization / Configuration for the Frontend
    theme: {
        primaryColor: { type: String, default: '#16a34a' }, // Default green color
        invoiceFormat: { type: String, default: 'Standard' }
    },
    
    // Global Admin Control
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }

}, { timestamps: true });

export default mongoose.model('Business', businessSchema);