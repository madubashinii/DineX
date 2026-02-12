import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { admin } from '../middleware/admin.middleware.js';
import {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllReservations,
    updateReservationStatus,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    updateUserRole
} from '../controllers/admin.controller.js';

const router = express.Router();

// Menu routes
router.get('/menu', protect, admin, getMenuItems);
router.post('/menu', protect, admin, createMenuItem);
router.put('/menu/:id', protect, admin, updateMenuItem);
router.delete('/menu/:id', protect, admin, deleteMenuItem);

// Reservation routes
router.get('/reservations', protect, admin, getAllReservations);
router.put('/reservations/:id', protect, admin, updateReservationStatus);

// Order routes
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUserRole);

export default router;
