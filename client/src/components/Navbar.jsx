import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    
    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;
    const baseLinkStyle = "px-3 py-2 rounded-md font-medium transition-colors";
    
    // Get link styles based on status
    const getLinkClass = (path, isMobile = false) => {
        const activeClass = "bg-emerald-700 text-white";
        const inactiveClass = "text-emerald-50 hover:text-white hover:bg-emerald-500";
        const mobileClass = isMobile ? "block" : "";
        return `${baseLinkStyle} ${isActive(path) ? activeClass : inactiveClass} ${mobileClass}`;
    };

    return (
        <nav className="bg-emerald-600 shadow-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center gap-4 md:gap-8">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center text-white font-bold text-xl drop-shadow-sm" onClick={closeMobileMenu}>
                            <Leaf className="mr-2" />
                            Plant Care Reminder
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation Links - Centered */}
                    <div className="hidden md:flex flex-1 justify-center space-x-6">
                        <Link to="/" className={getLinkClass('/')}>Home</Link>
                        <Link to="/about" className={getLinkClass('/about')}>About</Link>
                        <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
                        {user && <Link to="/feedback" className={getLinkClass('/feedback')}>Feedback</Link>}
                    </div>
                    
                    {/* Desktop Auth Links / User Info */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white font-medium">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-emerald-100 hover:text-white transition-colors p-2 rounded-md hover:bg-emerald-500"
                                >
                                    <LogOut className="w-5 h-5 mr-1" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className={getLinkClass('/login')}>Login</Link>
                                <Link to="/register" className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-md font-bold shadow-sm transition-colors">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-emerald-50 hover:text-white p-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-emerald-600 border-t border-emerald-500">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className={getLinkClass('/', true)} onClick={closeMobileMenu}>Home</Link>
                        <Link to="/about" className={getLinkClass('/about', true)} onClick={closeMobileMenu}>About</Link>
                        <Link to="/contact" className={getLinkClass('/contact', true)} onClick={closeMobileMenu}>Contact</Link>
                        {user && <Link to="/feedback" className={getLinkClass('/feedback', true)} onClick={closeMobileMenu}>Feedback</Link>}
                        
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-emerald-100 font-medium border-t border-emerald-500 mt-2 pt-2">
                                    Hello, {user.name}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center text-emerald-50 hover:text-white hover:bg-emerald-500 px-3 py-2 rounded-md font-medium transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="border-t border-emerald-500 mt-2 pt-2 space-y-2">
                                <Link to="/login" className={getLinkClass('/login', true)} onClick={closeMobileMenu}>Login</Link>
                                <Link to="/register" className="block text-center bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-md font-bold shadow-sm transition-colors" onClick={closeMobileMenu}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
