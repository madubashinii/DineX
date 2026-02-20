import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await API.get('/menu');
                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category.toLowerCase() === activeCategory);

    const handleAddToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = existingCart.findIndex(cartItem => cartItem._id === item._id);

        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
        } else {
            existingCart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));
        navigate('/cart');
    };

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Our Menu</h1>
                    <p className="text-xl text-gray-400">Exquisite dishes crafted with passion</p>
                </div>
            </section>

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

            <section className="py-16 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-zinc-900 rounded-lg overflow-hidden border border-amber-400/20 
                                         hover:border-amber-400/50 transition-all duration-300 
                                         hover:shadow-lg hover:shadow-amber-500/20"
                            >

                                <div className="h-56 w-full overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-zinc-800 text-6xl">🍽️</div>';
                                        }}
                                    />
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