import * as productService from './product.service.js';

// Save a new product
const addProduct = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const newProduct = await productService.addProduct(req.body, businessId);
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Get all products for the dropdown
const getProducts = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const products = await productService.getProducts(businessId);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export { addProduct, getProducts };