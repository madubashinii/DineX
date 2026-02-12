import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = false;
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 text-white hover:text-amber-400 
                 text-sm uppercase tracking-wider font-light"
                                >
                                    Profile
                                    <span className="text-xs">⌄</span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-black/95 
                      border border-amber-400/20 rounded-sm shadow-lg">
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="block w-full text-left px-4 py-2 text-sm 
                     text-white hover:bg-amber-400/10"
                                        >
                                            My Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                // logout logic 
                                                setIsProfileOpen(false);
                                                navigate('/');
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm 
                     text-red-400 hover:bg-red-500/10"
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
                                        onClick={() => {
                                            // logout 
                                            setIsProfileOpen(false);
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