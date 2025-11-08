// components/layout/ModernNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ModernNavbar() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                withCredentials: true,
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/courses', label: 'Courses', icon: '🎓' },
        { path: '/tasks', label: 'Tasks', icon: '✓' },
        { path: '/exams', label: 'Exams', icon: '🎯' },
        { path: '/grades', label: 'Grades', icon: '📊' },
        { path: '/finance', label: 'Finance', icon: '💰' },
        { path: '/habits', label: 'Habits', icon: '🔥' },
        { path: '/events', label: 'Events', icon: '📅' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Main Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-purple-900/30 backdrop-blur-xl border-b border-purple-500/20'
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    StudenCal
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Productivity Hub
                                </p>
                            </div>
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`group relative px-4 py-2 rounded-xl transition-all ${
                                        isActive(item.path)
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="flex items-center">
                                        <span
                                            className={`text-lg mr-2 ${
                                                isActive(item.path)
                                                    ? 'animate-bounce'
                                                    : ''
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </span>

                                    {/* Active Indicator */}
                                    {isActive(item.path) && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right Side - User & Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-110">
                                <span className="text-xl">🔔</span>
                                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>

                            {/* User Menu */}
                            <div className="relative group">
                                <button className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 transition-all">
                                    {user?.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full ring-2 ring-purple-500/50"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user?.displayName?.charAt(0) ||
                                                'U'}
                                        </div>
                                    )}
                                    <div className="hidden md:block text-left">
                                        <p className="text-white text-sm font-semibold">
                                            {user?.displayName?.split(' ')[0] ||
                                                'Student'}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Free Plan
                                        </p>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-56 bg-purple-900/95 backdrop-blur-xl rounded-xl border border-purple-500/20 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-4 border-b border-purple-500/20">
                                        <p className="text-white font-semibold">
                                            {user?.displayName || 'Student'}
                                        </p>
                                        <p className="text-gray-400 text-sm truncate">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-all flex items-center">
                                            <span className="mr-3">⚙️</span>
                                            Settings
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-all flex items-center">
                                            <span className="mr-3">🎨</span>
                                            Theme
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-all flex items-center">
                                            <span className="mr-3">💎</span>
                                            Upgrade
                                        </button>
                                    </div>

                                    <div className="p-2 border-t border-purple-500/20">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center"
                                        >
                                            <span className="mr-3">🚪</span>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-20 right-0 left-0 mx-4 bg-purple-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-4 animate-slide-down">
                        <div className="space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                                        isActive(item.path)
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="text-xl mr-3">
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer for fixed navbar */}
            <div className="h-20" />
        </>
    );
}
