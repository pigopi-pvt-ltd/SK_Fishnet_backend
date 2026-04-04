import express from 'express';
import { addProduct, getProducts } from './product.controller.js';

const router = express.Router();

router.post('/', addProduct);
router.get('/', getProducts);

export default router;