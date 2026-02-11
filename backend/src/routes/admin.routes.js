import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { admin } from '../middleware/admin.middleware.js';
import {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllReservations,
} from '../controllers/admin.controller.js';

const router = express.Router();

// Menu routes
router.get('/menu', protect, admin, getMenuItems);
router.post('/menu', protect, admin, createMenuItem);
router.put('/menu/:id', protect, admin, updateMenuItem);
router.delete('/menu/:id', protect, admin, deleteMenuItem);

// Reservation routes
router.get('/reservations', protect, admin, getAllReservations);

export default router;
