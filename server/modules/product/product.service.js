import Product from './product.model.js';

// 1. Save a new product
export const addProduct = async (productData, businessId) => {
    const { name, hsn, rate, price } = productData;
    
    // Check if product already exists FOR THIS SPECIFIC BUSINESS
    const existingProduct = await Product.findOne({ name, businessId });
    if (existingProduct) {
        throw new Error('Product already exists in your inventory');
    }

    const newProduct = new Product({ name, hsn, rate, price, businessId });
    return await newProduct.save();
};

// 2. Get all products for the dropdown
export const getProducts = async (businessId) => {
    // Only fetch products for this specific business
    return await Product.find({ businessId }).sort({ name: 1 }); 
};