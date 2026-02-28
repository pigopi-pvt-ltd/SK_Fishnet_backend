const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Logger import
require('dotenv').config();

const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); // Import Employee Routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Database Connection ---
connectDB();

// --- 2. Middleware ---
app.use(express.json()); 

// CORS Configuration (Security Best Practice)
const corsOptions = {
    // origin: process.env.FRONTEND_URL || '*',   // can change in production for safety purposes
    origin: ['https://sk-fishnet.pigo-pi.com', 'http://localhost:5173'],
    // methods: ['GET', 'POST', 'DELETE'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // credentials: true
};
app.use(cors(corsOptions));

// Logger (only in Development mode)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- 3. Routes ---
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes); // Employee Routes

// --- 4. Base Route ---
app.get('/', (req, res) => {
    res.send('API is running smoothly...');
});

// --- 5. Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});