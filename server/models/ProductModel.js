const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Product Name (Should be unique)
    hsn: { type: String, required: true }, // HSN Code
    rate: { type: Number, required: true }, // GST Rate
    price: { type: Number, default: 0 } // Optional base price
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);