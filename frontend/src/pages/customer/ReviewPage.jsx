import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ReviewPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        let timer;

        if (success) {
            timer = setTimeout(() => {
                navigate('/orders');
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [success, navigate]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError('');

            const { data } = await API.get(`/orders/${orderId}`);
            setOrder(data);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }

            if (error.response?.status === 404) {
                setError('Order not found');
                return;
            }

            setError(
                error.response?.data?.message || 'Failed to load order'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        if (!comment.trim()) {
            setError('Please write your review.');
            return;
        }

        try {
            setSubmitting(true);

            const { data } = await API.post('/reviews', {
                orderId,
                rating,
                comment: comment.trim(),
            });

            setSuccess(data.message || 'Review submitted successfully!');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }

            setError(
                error.response?.data?.message ||
                'Failed to submit review'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-lg">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-8 shadow-2xl">

                        <h1 className="text-4xl font-serif text-white mb-3">
                            Write a Review
                        </h1>

                        <p className="text-gray-400 mb-8">
                            Share your dining experience with us.
                        </p>

                        {/* Order Details */}
                        <div className="mb-8 p-6 rounded-xl bg-black/40 border border-amber-400/10">
                            <h3 className="text-white font-semibold text-lg mb-4">
                                Order #{order._id.slice(-8).toUpperCase()}
                            </h3>

                            <div className="space-y-3">
                                {order.orderItems?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center text-gray-300 border-b border-zinc-800 pb-2"
                                    >
                                        <span>
                                            {item.name} × {item.qty}
                                        </span>

                                        <span className="text-amber-400 font-medium">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Rating */}
                            <div>
                                <label className="block text-white mb-4 font-medium">
                                    Your Rating
                                </label>

                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`w-10 h-10 ${star <= (hover || rating)
                                                        ? 'text-amber-400'
                                                        : 'text-zinc-600'
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.068-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-white mb-4 font-medium">
                                    Your Review
                                </label>

                                <textarea
                                    rows="6"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    className="w-full px-5 py-4 bg-black/50 border border-amber-400/20 rounded-xl
                                             text-white placeholder-gray-500 resize-none
                                             focus:outline-none focus:border-amber-400"
                                    disabled={submitting || success}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || success}
                                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500
                                         text-black py-4 rounded-xl font-bold uppercase tracking-wider
                                         hover:shadow-lg hover:shadow-amber-500/40
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-all duration-300"
                            >
                                {submitting
                                    ? 'Submitting Review...'
                                    : success
                                        ? 'Review Submitted ✓'
                                        : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}