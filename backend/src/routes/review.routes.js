import express from 'express';
import {
    createReview,
    getAllReviews,
    getMyReviews,
    deleteReview,
    getReviewStats,
} from '../controllers/review.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/stats', getReviewStats);

router.post('/', protect, createReview);
router.get('/me', protect, getMyReviews);
router.delete('/:id', protect, deleteReview);

export default router;