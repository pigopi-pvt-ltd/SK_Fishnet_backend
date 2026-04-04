import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import { protect } from './middleware/authMiddleware.js'; 
import authRoutes from './modules/auth/auth.routes.js'; 
import invoiceRoutes from './modules/invoice/invoice.routes.js';
import productRoutes from './modules/product/product.routes.js';
import employeeRoutes from './modules/employee/employee.routes.js'; 
import paymentRoutes from './modules/payment/payment.routes.js';  
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'; 
import businessRoutes from './modules/business/business.routes.js'; 

// Import models for wiping script
import Invoice from './modules/invoice/invoice.model.js';
import Product from './modules/product/product.model.js';
import Employee from './modules/employee/employee.model.js';
import Vendor from './modules/payment/vendor.model.js';
import SalesLedger from './modules/payment/salesLedger.model.js';
import User from './modules/auth/auth.model.js';
import Business from './modules/business/business.model.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Database Connection ---
connectDB();

// --- Middleware ---
app.use(express.json()); 
app.use(cookieParser()); 

// SAAS CORS Configuration (Secure & Dynamic)
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true  
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes ---
app.use('/api/auth', authRoutes); 
app.use('/api/invoices', protect, invoiceRoutes);
app.use('/api/products', protect, productRoutes);
app.use('/api/employees', protect, employeeRoutes); 
app.use('/api/payments', protect, paymentRoutes);  
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/business', businessRoutes); 

// --- Base Route ---
app.get('/', (req, res) => {
    res.send('SK Fishnet SaaS API is running smoothly...');
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});