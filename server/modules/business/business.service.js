import Business from './business.model.js';
import User from '../auth/auth.model.js'; 
import Invoice from '../invoice/invoice.model.js';
import Product from '../product/product.model.js';
import Employee from '../employee/employee.model.js';
import Vendor from '../payment/vendor.model.js';
import SalesLedger from '../payment/salesLedger.model.js';

// Business Logic
export const setupBusiness = async (businessId, updateData) => {
    const { name, industry, primaryColor } = updateData;
    const updatedBusiness = await Business.findByIdAndUpdate(
        businessId,
        { name, industry, theme: { primaryColor, invoiceFormat: 'Standard' } },
        { new: true, runValidators: true }
    );
    if (!updatedBusiness) throw new Error('Business not found in Database');
    return updatedBusiness;
};

// GLOBAL ADMIN POWERS

// Get All Clients (Fixed to prevent N/A for GlobalAdmin owners)
export const getAllBusinesses = async () => {
    const businesses = await Business.find().sort({ createdAt: -1 });
    // Fetch all users who have a businessId assigned (Superadmin or GlobalAdmin)
    const users = await User.find({ businessId: { $ne: null } }).select('-password');

    const masterList = businesses.map(biz => {
        const owner = users.find(u => String(u.businessId) === String(biz._id));
        return {
            ...biz.toObject(),
            ownerName: owner ? owner.name : 'User Deleted (Orphan)',
            ownerEmail: owner ? owner.email : 'N/A'
        };
    });

    return masterList;
};

// Create New Client
export const createNewClient = async (clientData) => {
    const { name, email, password } = clientData;
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("Email already registered in the system.");

    const newBusiness = await Business.create({ name: `${name}'s Workspace`, email });
    const user = await User.create({ name, email, password, role: 'Superadmin', businessId: newBusiness._id, isGlobalAdmin: false });

    return { business: newBusiness, user: { name: user.name, email: user.email } };
};

// DELETE CLIENT
export const deleteClientData = async (businessId) => {
    await Invoice.deleteMany({ businessId });
    await Product.deleteMany({ businessId });
    await Employee.deleteMany({ businessId });
    await Vendor.deleteMany({ businessId });
    await SalesLedger.deleteMany({ businessId });
    
    // Delete user and it's business association (if any)
    await User.deleteMany({ businessId });
    await Business.findByIdAndDelete(businessId);
    
    return true;
};