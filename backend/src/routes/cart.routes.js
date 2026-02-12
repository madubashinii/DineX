import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/:menuItemId', protect, removeFromCart);

export default router;
