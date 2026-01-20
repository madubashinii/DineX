import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    const menuItems = [
        {
            id: 1,
            name: 'Wagyu Beef Steak',
            description: 'Premium A5 Japanese Wagyu, perfectly seared and served with truffle butter',
            price: 89,
            emoji: '🥩',
            category: 'Main Course',
        },
        {
            id: 2,
            name: 'Lobster Thermidor',
            description: 'Fresh Atlantic lobster in a creamy brandy sauce with Gruyère cheese',
            price: 75,
            emoji: '🦞',
            category: 'Seafood',
        },
        {
            id: 3,
            name: 'Truffle Pasta',
            description: 'Handmade pasta with black truffle shavings and Parmigiano-Reggiano',
            price: 62,
            emoji: '🍝',
            category: 'Pasta',
        },
        {
            id: 4,
            name: 'Chilean Sea Bass',
            description: 'Pan-seared sea bass with lemon beurre blanc and seasonal vegetables',
            price: 68,
            emoji: '🐟',
            category: 'Seafood',
        },
        {
            id: 5,
            name: 'Chocolate Soufflé',
            description: 'Light and airy Belgian chocolate soufflé with vanilla bean ice cream',
            price: 28,
            emoji: '🍰',
            category: 'Dessert',
        },
        {
            id: 6,
            name: 'Wine Pairing',
            description: 'Sommelier-selected wines perfectly matched to your dining experience',
            price: 45,
            emoji: '🍷',
            category: 'Beverages',
        },
    ];

    const features = [
        {
            icon: '👨‍🍳',
            title: 'Master Chefs',
            description: 'Our award-winning chefs bring decades of culinary expertise and innovation to every plate',
        },
        {
            icon: '🌿',
            title: 'Fresh Ingredients',
            description: 'We source only the finest organic and locally-sourced ingredients daily',
        },
        {
            icon: '✨',
            title: 'Premium Experience',
            description: 'Impeccable service and elegant ambiance create unforgettable dining moments',
        },
        {
            icon: '🍾',
            title: 'Curated Selection',
            description: 'Extensive wine cellar featuring rare vintages from renowned vineyards worldwide',
        },
    ];

    const reviews = [
        {
            id: 1,
            text: 'An absolutely exquisite dining experience. The Wagyu steak was perfectly cooked, and the ambiance transported us to another world. Worth every penny!',
            author: 'Sarah Mitchell',
            title: 'Food Critic, Gourmet Magazine',
            rating: 5,
        },
        {
            id: 2,
            text: 'The attention to detail is remarkable. From the moment we walked in until dessert, every aspect was flawless. The truffle pasta is a must-try!',
            author: 'James Rodriguez',
            title: 'Executive Chef, NYC',
            rating: 5,
        },
        {
            id: 3,
            text: 'DineX has redefined fine dining for me. The wine pairing was exceptional, and the staff\'s knowledge and service were impeccable. Highly recommend!',
            author: 'Emily Chen',
            title: 'Wine Enthusiast',
            rating: 5,
        },
    ];

    const handleAddToCart = (item) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <section
                id="home"
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >

                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                    </div>
                </div>

                <div className="relative z-10 text-center px-6 py-32 max-w-5xl mx-auto">
                    <div className="animate-fade-in-up">
                        <h1 className="text-6xl md:text-8xl font-serif font-light tracking-wide mb-6 text-white">
                            Experience
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mt-2">
                                Fine Dining
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Indulge in a culinary journey where tradition meets innovation
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button
                                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 
                         text-black font-bold text-lg rounded-sm uppercase tracking-wider
                         hover:shadow-2xl hover:shadow-amber-500/50 
                         transform hover:-translate-y-1 transition-all duration-300
                         overflow-hidden"
                            >
                                <span className="relative z-10">Order Now</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 
                              transform scale-x-0 group-hover:scale-x-100 transition-transform 
                              duration-300 origin-left"></div>
                            </button>
                            <button
                                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-4 border-2 border-amber-400 text-amber-400 font-bold 
                         text-lg rounded-sm uppercase tracking-wider
                         hover:bg-amber-400 hover:text-black
                         transform hover:-translate-y-1 transition-all duration-300"
                            >
                                View Menu
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-6 h-6 text-amber-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>

            {/* Featured Menu Section */}
            <section id="menu" className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-wide mb-4">
                            Featured Dishes
                        </h2>
                        <p className="text-xl text-gray-400">Curated selections from our master chefs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menuItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-zinc-900 rounded-lg overflow-hidden shadow-2xl 
                         hover:shadow-amber-500/20 transition-all duration-500
                         hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Placeholder */}
                                <div className="relative h-64 bg-gradient-to-br from-zinc-800 to-zinc-900 
                              flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-amber-400/10 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="text-8xl transform group-hover:scale-110 transition-transform duration-500">
                                        {item.emoji}
                                    </span>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm 
                                px-3 py-1 rounded-full text-xs text-amber-400 border border-amber-400/30">
                                        {item.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-serif mb-2 text-white">{item.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl font-bold text-transparent bg-clip-text 
                                   bg-gradient-to-r from-amber-400 to-yellow-500">
                                            ${item.price}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 
                             text-black font-bold py-3 rounded-md uppercase tracking-wider
                             hover:shadow-lg hover:shadow-amber-500/50 
                             transform hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-16">
                    <button
                        onClick={() => navigate('/menu')}
                        className="px-10 py-3 border-2 border-amber-400 text-amber-400 
               uppercase tracking-wider font-semibold
               hover:bg-amber-400 hover:text-black
               transition-all duration-300"
                    >
                        View Full Menu
                    </button>
                </div>

            </section>

            {/* Why Choose Us Section */}
            <section id="about" className="py-24 px-6 bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-wide mb-4">
                            Why Choose DineX
                        </h2>
                        <p className="text-xl text-gray-400">Excellence in every detail</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-lg hover:bg-zinc-900 
                         transition-all duration-300 group"
                            >
                                <div className="text-7xl mb-6 transform group-hover:scale-110 
                              transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-serif mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-wide mb-4">
                            Guest Reviews
                        </h2>
                        <p className="text-xl text-gray-400">What our patrons say about us</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-zinc-900 p-8 rounded-lg border-l-4 border-amber-400 
                         hover:shadow-xl hover:shadow-amber-500/10 
                         transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-amber-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-300 italic mb-6 leading-relaxed">
                                    "{review.text}"
                                </p>

                                <div className="border-t border-zinc-800 pt-4">
                                    <p className="text-amber-400 font-bold">{review.author}</p>
                                    <p className="text-gray-500 text-sm">{review.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

        </div>
    );
}