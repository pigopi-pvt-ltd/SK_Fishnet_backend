const Product = require('../models/ProductModel');

// Save a new product
const addProduct = async (req, res) => {
    try {
        const { name, hsn, rate, price } = req.body;
        // Check if product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product already exists' });
        }

        const newProduct = new Product({ name, hsn, rate, price });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Get all products for the dropdown
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ name: 1 }); // Alphabetical order
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

module.exports = { addProduct, getProducts };