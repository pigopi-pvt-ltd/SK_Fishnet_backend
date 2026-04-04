import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    // SAAS FIELD: Data Isolation
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },

    // Basic Details
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    role: { type: String, default: 'Worker' },
    
    // Personal Details
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    age: { type: Number, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    
    // Address Details
    address: { type: String, default: '' },
    alternateAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
    state: { type: String, default: '' },
    pinCode: { type: String, default: '' },
    
    // Emergency Contact / Reference
    referenceName: { type: String, default: '' },
    referencePhone: { type: String, default: '' },
    referenceRelation: { type: String, default: '' },

    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    
    // KYC Details
    kyc: {
        aadharNumber: { type: String, default: '' },
        panNumber: { type: String, default: '' },
        bankName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
    },

    // Ledger / Khata
    transactions: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['Advance Given', 'Salary Paid', 'Deduction', 'Deposit with Admin', 'Other'], required: true },
        amount: { type: Number, required: true },
        description: { type: String }
    }],

    outstandingBalance: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);