import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

export const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId, rating, comment } = req.body;

        if (!orderId || !rating) {
            return res.status(400).json({ message: 'OrderId and rating are required' });
        }

        // Check order exists
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not your order' });
        }

        // Allow only delivered orders
        if (order.status !== 'Completed') {
            return res.status(400).json({ message: 'You can review only delivered orders' });
        }

        // Prevent duplicate review
        const existingReview = await Review.findOne({ order: orderId });

        if (existingReview) {
            return res.status(400).json({ message: 'You already reviewed this order' });
        }

        // Create review
        const review = await Review.create({
            user: userId,
            order: orderId,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('order')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user.id;

        const reviews = await Review.find({ user: userId })
            .populate('order')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // only owner can delete
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.deleteOne();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReviewStats = async (req, res) => {
    try {
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        res.json(
            stats[0] || {
                averageRating: 0,
                totalReviews: 0,
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};