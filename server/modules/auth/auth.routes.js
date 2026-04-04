import express from 'express';
import { registerAdmin, loginAdmin, logoutAdmin, getMe } from './auth.controller.js';
import { protect } from '../../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// 'protect' middleware ensures that only authenticated users can access this route
router.get('/me', protect, getMe);

export default router;