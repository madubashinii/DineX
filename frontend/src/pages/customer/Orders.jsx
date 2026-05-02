import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Processing':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const renderTimeline = (status) => {
        const steps = ['Placed', 'Processing', 'Completed'];
        return (
            <div className="p-6 border-t border-amber-400/10 bg-black/20">
                <div className="flex items-center gap-4">
                    {steps.map((step, idx) => {
                        const completed = (step === 'Placed') || (step === 'Processing' && (status === 'Processing' || status === 'Completed')) || (step === 'Completed' && status === 'Completed');
                        const cancelled = status === 'Cancelled';
                        return (
                            <div key={step} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${cancelled ? 'bg-red-400' : completed ? 'bg-amber-400' : 'bg-zinc-700'} border ${cancelled ? 'border-red-500/30' : completed ? 'border-amber-400/30' : 'border-amber-400/10'}`}></div>
                                <div className={`text-sm ${completed ? 'text-white' : 'text-gray-400'}`}>{step}</div>
                                {idx < steps.length - 1 && <div className={`w-12 h-px ${completed ? 'bg-amber-400/50' : 'bg-amber-400/10'}`}></div>}
                            </div>
                        );
                    })}
                    {status === 'Cancelled' && <div className="ml-4 text-sm text-red-400">Order Cancelled</div>}
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const { data } = await API.get('/orders');
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }
            setErrorMessage(error.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Order History</h1>
                    <p className="text-xl text-gray-400">Track all your orders</p>
                </div>
            </section>

            <section className="py-16 px-6 bg-black">
                <div className="max-w-6xl mx-auto">
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                            {errorMessage}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg mb-6">No orders yet</p>
                            <button
                                onClick={() => navigate('/menu')}
                                className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                         px-8 py-3 rounded-md font-semibold uppercase tracking-wider
                                         hover:shadow-lg hover:shadow-amber-500/50 
                                         hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-zinc-900 rounded-lg border border-amber-400/20 overflow-hidden hover:border-amber-400/40 transition-colors"
                                >
                                    {/* Order Header */}
                                    <div className="p-6 bg-black/50 border-b border-amber-400/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Order ID</p>
                                            <p className="text-white font-mono text-lg">{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Date & Time</p>
                                            <p className="text-white">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Total</p>
                                            <p className="text-amber-400 font-semibold text-lg">
                                                ${order.totalPrice?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-white font-semibold">Order Items</h3>
                                        <div className="space-y-3">
                                            {order.orderItems && order.orderItems.length > 0 ? (
                                                order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-amber-400/10">
                                                        <div>
                                                            <p className="text-white">{item.name}</p>
                                                            <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                                                        </div>
                                                        <p className="text-amber-400 font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400">No items in this order</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {order.deliveryAddress && Object.keys(order.deliveryAddress).length > 0 && (
                                        <div className="p-6 bg-black/30 border-t border-amber-400/10">
                                            <h3 className="text-white font-semibold mb-3">Delivery Address</h3>
                                            <div className="text-gray-400 text-sm space-y-1">
                                                {order.deliveryAddress.fullName && (
                                                    <p>
                                                        <span className="text-gray-500">Name:</span> {order.deliveryAddress.fullName}
                                                    </p>
                                                )}
                                                {order.deliveryAddress.address && (
                                                    <p>
                                                        <span className="text-gray-500">Address:</span> {order.deliveryAddress.address}
                                                    </p>
                                                )}
                                                {order.deliveryAddress.city && (
                                                    <p>
                                                        <span className="text-gray-500">City:</span> {order.deliveryAddress.city}
                                                    </p>
                                                )}
                                                {order.deliveryAddress.zipCode && (
                                                    <p>
                                                        <span className="text-gray-500">Zip Code:</span> {order.deliveryAddress.zipCode}
                                                    </p>
                                                )}
                                                {order.deliveryAddress.phone && (
                                                    <p>
                                                        <span className="text-gray-500">Phone:</span> {order.deliveryAddress.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Timeline */}
                                    {renderTimeline(order.status)}

                                    {order.status === 'Completed' && (
                                        <div className="p-6 border-t border-amber-400/10 bg-black/30">
                                            <button
                                                onClick={() => navigate(`/review/${order._id}`)}
                                                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black
                     px-6 py-3 rounded-md font-semibold uppercase tracking-wider
                     hover:shadow-lg hover:shadow-amber-500/40
                     hover:-translate-y-0.5 transition-all duration-300"
                                            >
                                                Write Review
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
