import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });
    const profileRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        const onStorage = () => {
            try {
                setUser(JSON.parse(localStorage.getItem('user')) || null);
                setIsLoggedIn(!!localStorage.getItem('token'));
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    const handleNavClick = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            element?.scrollIntoView({ behavior: 'smooth' });
        }

        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-amber-500/5'
                : 'bg-black/80 backdrop-blur-md'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-serif tracking-[0.3em] text-amber-400 font-bold">
                            DineX
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center space-x-10">
                        {['home', 'menu', 'about', 'reviews', 'contact'].map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => handleNavClick(item)}
                                    className="relative text-white text-sm uppercase tracking-wider font-light 
                           hover:text-amber-400 transition-colors duration-300 group py-2"
                                >
                                    {item}
                                    <span
                                        className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r 
                             from-amber-400 to-yellow-300 transition-all duration-300 
                             group-hover:w-full"
                                    ></span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">

                        {!isLoggedIn ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="text-white hover:text-amber-400 text-sm uppercase tracking-wider 
               font-light transition-colors duration-300 px-4"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 text-white hover:text-amber-400 
                 text-sm tracking-wider"
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-semibold">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <div className="text-sm font-semibold">{user?.name || 'User'}</div>
                                        <div className="text-xs text-gray-300">{user?.email}</div>
                                    </div>
                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1l-4.25 4.657a.75.75 0 01-1.12 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                                    </svg>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-black/95 
                      border border-amber-400/20 rounded-md shadow-lg py-2">
                                        <div className="px-4 py-2 border-b border-amber-400/10">
                                            <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                                            <div className="text-xs text-gray-400">{user?.email || ''}</div>
                                            <div className="text-xs text-gray-400 mt-1">{user?.role || 'customer'}</div>
                                        </div>
                                        <button
                                            onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-amber-400/10"
                                        >
                                            My Profile
                                        </button>
                                        <button
                                            onClick={() => { setIsProfileOpen(false); navigate('/orders'); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-amber-400/10"
                                        >
                                            Order History
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => { setIsProfileOpen(false); navigate('/admin'); }}
                                                className="block w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-amber-400/5"
                                            >
                                                Admin Dashboard
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('user');
                                                setIsProfileOpen(false);
                                                setIsLoggedIn(false);
                                                setUser(null);
                                                navigate('/');
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/reserve')}
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                       px-6 py-2.5 rounded-sm font-semibold text-sm uppercase tracking-wider
                       hover:shadow-lg hover:shadow-amber-500/50 hover:-translate-y-0.5
                       transition-all duration-300"
                        >
                            Reserve Table
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-amber-400 focus:outline-none"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <ul className="py-4 space-y-4 border-t border-amber-400/20">
                        {['home', 'menu', 'about', 'reviews', 'contact'].map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => handleNavClick(item)}
                                    className="block w-full text-left text-white text-sm uppercase tracking-wider 
                           hover:text-amber-400 transition-colors duration-300 py-2 px-2"
                                >
                                    {item}
                                </button>
                            </li>
                        ))}

                        {!isLoggedIn ? (
                            <li>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="block w-full text-left text-white text-sm uppercase tracking-wider 
                 hover:text-amber-400 py-2 px-2"
                                >
                                    Login
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="block w-full text-left text-white text-sm uppercase tracking-wider 
                   hover:text-amber-400 py-2 px-2"
                                    >
                                        My Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="block w-full text-left text-white text-sm uppercase tracking-wider 
                   hover:text-amber-400 py-2 px-2"
                                    >
                                        Order History
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            // logout
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            setIsProfileOpen(false);
                                            setIsLoggedIn(false);
                                            setUser(null);
                                            navigate('/');
                                        }}
                                        className="block w-full text-left text-red-400 text-sm uppercase tracking-wider 
                   hover:text-red-500 py-2 px-2"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}


                        <li>
                            <button
                                onClick={() => {
                                    navigate('/reserve');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black 
                         px-6 py-2.5 rounded-sm font-semibold text-sm uppercase tracking-wider"
                            >
                                Reserve Table
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}