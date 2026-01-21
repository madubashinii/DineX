import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState([]);

    const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

    const menuItems = [
        {
            id: 1,
            name: 'Wagyu Beef Steak',
            description: 'Premium A5 Japanese Wagyu, perfectly seared with truffle butter',
            price: 89,
            category: 'Main Course',
            image: '🥩'
        },
        {
            id: 2,
            name: 'Lobster Thermidor',
            description: 'Fresh Atlantic lobster in creamy brandy sauce with Gruyère',
            price: 75,
            category: 'Main Course',
            image: '🦞'
        },
        {
            id: 3,
            name: 'Truffle Pasta',
            description: 'Handmade pasta with black truffle and Parmigiano-Reggiano',
            price: 62,
            category: 'Main Course',
            image: '🍝'
        },
        {
            id: 4,
            name: 'Chilean Sea Bass',
            description: 'Pan-seared sea bass with lemon beurre blanc',
            price: 68,
            category: 'Main Course',
            image: '🐟'
        },
        {
            id: 5,
            name: 'Foie Gras',
            description: 'Seared foie gras with caramelized figs and brioche',
            price: 45,
            category: 'Appetizers',
            image: '🍖'
        },
        {
            id: 6,
            name: 'Oysters Rockefeller',
            description: 'Fresh oysters baked with herbs and parmesan',
            price: 38,
            category: 'Appetizers',
            image: '🦪'
        },
        {
            id: 7,
            name: 'Tuna Tartare',
            description: 'Fresh tuna with avocado, sesame, and wasabi aioli',
            price: 32,
            category: 'Appetizers',
            image: '🐟'
        },
        {
            id: 8,
            name: 'Chocolate Soufflé',
            description: 'Belgian chocolate soufflé with vanilla ice cream',
            price: 28,
            category: 'Desserts',
            image: '🍰'
        },
        {
            id: 9,
            name: 'Crème Brûlée',
            description: 'Classic French custard with caramelized sugar',
            price: 24,
            category: 'Desserts',
            image: '🍮'
        },
        {
            id: 10,
            name: 'Tiramisu',
            description: 'Italian coffee-soaked ladyfingers with mascarpone',
            price: 22,
            category: 'Desserts',
            image: '🍰'
        },
        {
            id: 11,
            name: 'Wine Pairing',
            description: 'Sommelier-selected wines matched to your meal',
            price: 45,
            category: 'Beverages',
            image: '🍷'
        },
        {
            id: 12,
            name: 'Craft Cocktails',
            description: 'Signature cocktails crafted by our mixologists',
            price: 18,
            category: 'Beverages',
            image: '🍸'
        }
    ];

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category.toLowerCase() === activeCategory);

    const handleAddToCart = (item) => {
        // Add item to cart (save to localStorage for persistence)
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
        } else {
            existingCart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));
        setCart(existingCart);

        // Navigate to cart page
        window.location.href = '/cart'; // Or use React Router: navigate('/cart')
    };

    return (
        <div className="min-h-screen bg-black">
            <Header />

            {/* Page Header */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Our Menu</h1>
                    <p className="text-xl text-gray-400">Exquisite dishes crafted with passion</p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 px-6 bg-black border-b border-amber-400/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category.toLowerCase())}
                                className={`px-6 py-2 rounded-full text-sm uppercase tracking-wider transition-all duration-300 ${activeCategory === category.toLowerCase()
                                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold'
                                        : 'bg-zinc-900 text-gray-400 hover:text-amber-400 border border-amber-400/30'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu Items Grid */}
            <section className="py-16 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-zinc-900 rounded-lg overflow-hidden border border-amber-400/20 
                                         hover:border-amber-400/50 transition-all duration-300 
                                         hover:shadow-lg hover:shadow-amber-500/20"
                            >
                                {/* Item Image */}
                                <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 
                                              flex items-center justify-center text-7xl">
                                    {item.image}
                                </div>

                                {/* Item Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif text-white">{item.name}</h3>
                                        <span className="text-2xl font-bold text-amber-400">${item.price}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-block px-3 py-1 bg-black/50 rounded-full 
                                                       text-xs text-amber-400 border border-amber-400/30">
                                            {item.category}
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                                                     px-5 py-2 rounded-md font-semibold text-sm uppercase tracking-wider
                                                     hover:shadow-lg hover:shadow-amber-500/50 
                                                     hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
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