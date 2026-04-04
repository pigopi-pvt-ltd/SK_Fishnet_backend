import User from './auth.model.js';
import Business from '../business/business.model.js'; // Import the new Business model
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token (Now includes SaaS details)
const generateToken = (id, role, businessId, isGlobalAdmin) => {
    return jwt.sign(
        { id, role, businessId, isGlobalAdmin }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};

// 1. Signup Logic (Creates Business + Superadmin)
export const registerAdmin = async ({ name, email, password }) => {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User already exists with this email"); 
    }

    // ==========================================
    // SAAS ONBOARDING LOGIC
    // ==========================================
    
    // 1. Create a default business wrapper for this new client
    const newBusiness = await Business.create({
        name: `${name}'s Business`, // Temporary name, client updates this in onboarding
        email: email
    });

    // 2. Create the Superadmin and link them to the newly created Business
    const user = await User.create({ 
        name, 
        email, 
        password, 
        role: 'Superadmin', 
        businessId: newBusiness._id,
        isGlobalAdmin: false // Only you can manually set this to true in the Database
    });
    
    // Generate Token
    const token = generateToken(user._id, user.role, user.businessId, user.isGlobalAdmin);
    
    return { user, token };
};

// 2. Login Logic
export const loginAdmin = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate Token
    const token = generateToken(user._id, user.role, user.businessId, user.isGlobalAdmin);
    
    return { user, token };
};

// 3. Get Me Logic
export const getMe = async (userId) => {
    // .populate('businessId') fetches the actual business details (industry, theme) along with the user
    const user = await User.findById(userId).select('-password').populate('businessId');
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};