import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(savedCart);
    }, []);

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-black">
            <Header />

            {/* Page Header */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Your Cart</h1>
                    <p className="text-xl text-gray-400">Review your selections</p>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-16 px-6 bg-black">
                <div className="max-w-5xl mx-auto">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">🛒</div>
                            <h2 className="text-3xl font-serif text-white mb-4">Your cart is empty</h2>
                            <p className="text-gray-400 mb-8">Add some delicious items to get started</p>
                            <a
                                href="/menu"
                                className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                         px-8 py-3 rounded-md font-semibold uppercase tracking-wider
                                         hover:shadow-lg hover:shadow-amber-500/50 
                                         hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Browse Menu
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20 
                                                 hover:border-amber-400/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Item Image */}
                                            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 
                                                          rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                                                {item.image}
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-serif text-white mb-1">{item.name}</h3>
                                                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                                                <div className="flex items-center gap-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 bg-black border border-amber-400/30 rounded 
                                                                     text-amber-400 hover:bg-amber-400 hover:text-black 
                                                                     transition-all duration-300"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-white font-semibold w-8 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 bg-black border border-amber-400/30 rounded 
                                                                     text-amber-400 hover:bg-amber-400 hover:text-black 
                                                                     transition-all duration-300"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <span className="text-2xl font-bold text-amber-400">
                                                        ${item.price * item.quantity}
                                                    </span>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="ml-auto text-gray-400 hover:text-red-500 
                                                                 transition-colors duration-300"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Clear Cart Button */}
                                <button
                                    onClick={clearCart}
                                    className="w-full bg-zinc-900 text-gray-400 py-3 rounded-md 
                                             border border-amber-400/20 hover:border-red-500/50 
                                             hover:text-red-500 transition-all duration-300"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-zinc-900 rounded-lg p-6 border border-amber-400/20 sticky top-24">
                                    <h2 className="text-2xl font-serif text-white mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tax (10%)</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-amber-400/20 pt-4">
                                            <div className="flex justify-between text-xl font-bold">
                                                <span className="text-white">Total</span>
                                                <span className="text-amber-400">${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                                 py-3 rounded-md font-semibold uppercase tracking-wider
                                                 hover:shadow-lg hover:shadow-amber-500/50 
                                                 hover:-translate-y-0.5 transition-all duration-300 mb-3"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <a
                                        href="/menu"
                                        className="block w-full text-center bg-zinc-800 text-amber-400 
                                                 py-3 rounded-md font-semibold border border-amber-400/30
                                                 hover:bg-amber-400/10 transition-all duration-300"
                                    >
                                        Continue Shopping
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}