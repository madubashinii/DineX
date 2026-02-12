import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createReservation, getUserReservations, cancelReservation } from '../controllers/reservation.controller.js';

const router = express.Router();

router.post('/', protect, createReservation);
router.get('/', protect, getUserReservations);
router.delete('/:id', protect, cancelReservation);

export default router;
