import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // 'Superadmin' represents the owner of a specific business (Tenant)
    role: { type: String, enum: ['Superadmin', 'GlobalAdmin'], default: 'Superadmin' },
    
    // ==========================================
    // SAAS MULTI-TENANCY FIELDS
    // ==========================================
    
    // Links this user to a specific Business. If null, they might be the Global Admin.
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        default: null 
    },
    
    // True ONLY for you (The platform owner)
    isGlobalAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// PASSWORD HASHING
userSchema.pre('save', async function() {
    // If password is not modified, move to next middleware
    if (!this.isModified('password')) return;
    
    // Salt and hash the password before saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// PASSWORD CHECKER : Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);