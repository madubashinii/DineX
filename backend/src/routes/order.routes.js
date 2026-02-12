import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { placeOrder, getUserOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);

export default router;
