import express from 'express';
import { setupBusiness, getAllClients, createClient, deleteClient } from './business.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.put('/setup', protect, setupBusiness);

// Global Admin Routes
router.get('/clients', protect, getAllClients);
router.post('/clients', protect, createClient);
router.delete('/clients/:id', protect, deleteClient); // new route for deleting a client

export default router;