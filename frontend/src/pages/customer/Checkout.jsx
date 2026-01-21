import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(savedCart);
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle checkout logic here
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = '/';
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const delivery = 10;
    const total = subtotal + tax + delivery;

    return (
        <div className="min-h-screen bg-black">
            <Header />

            {/* Page Header */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Checkout</h1>
                    <p className="text-xl text-gray-400">Complete your order</p>
                </div>
            </section>

            {/* Checkout Content */}
            <section className="py-16 px-6 bg-black">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                    <h2 className="text-2xl font-serif text-white mb-6">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                    <h2 className="text-2xl font-serif text-white mb-6">Delivery Address</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Street Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="New York"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    required
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="10001"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20">
                                    <h2 className="text-2xl font-serif text-white mb-6">Payment Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                required
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                         transition-colors duration-300"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    required
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2">CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    required
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-md 
                                                             text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 
                                                             transition-colors duration-300"
                                                    placeholder="123"
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                             py-4 rounded-md font-semibold text-lg uppercase tracking-wider
                                             hover:shadow-lg hover:shadow-amber-500/50 
                                             hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20 sticky top-24">
                                <h2 className="text-2xl font-serif text-white mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-amber-400/10">
                                            <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 
                                                          rounded flex items-center justify-center text-2xl flex-shrink-0">
                                                {item.image}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate">{item.name}</p>
                                                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-amber-400 font-semibold text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Tax (10%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Delivery Fee</span>
                                        <span>${delivery.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-amber-400/20 pt-3">
                                        <div className="flex justify-between text-xl font-bold">
                                            <span className="text-white">Total</span>
                                            <span className="text-amber-400">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="bg-black/50 rounded p-3 border border-amber-400/20">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-gray-400 text-xs">
                                            Your payment information is secure and encrypted
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}