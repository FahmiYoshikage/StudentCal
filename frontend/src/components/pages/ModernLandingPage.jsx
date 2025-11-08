// components/pages/ModernLandingPage.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ModernLandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e] overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Orbs */}
                <div
                    className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl"
                    style={{
                        left: `${mousePosition.x * 0.02}px`,
                        top: `${mousePosition.y * 0.02}px`,
                        transition: 'all 0.3s ease-out',
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl right-0 bottom-0"
                    style={{
                        right: `${mousePosition.x * 0.01}px`,
                        bottom: `${mousePosition.y * 0.01}px`,
                        transition: 'all 0.3s ease-out',
                    }}
                />
                <div
                    className="absolute w-72 h-72 rounded-full bg-pink-500 opacity-15 blur-3xl"
                    style={{
                        left: '50%',
                        top: '30%',
                        transform: `translate(-50%, -50%) scale(${
                            1 + scrollY * 0.001
                        })`,
                    }}
                />

                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                            transform: `perspective(500px) rotateX(60deg) translateY(${
                                scrollY * 0.5
                            }px)`,
                        }}
                    />
                </div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className="relative z-50 container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform">
                            <span className="text-2xl">📚</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            StudenCal
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#features"
                            className="text-gray-300 hover:text-purple-400 transition"
                        >
                            Features
                        </a>
                        <a
                            href="#showcase"
                            className="text-gray-300 hover:text-purple-400 transition"
                        >
                            Showcase
                        </a>
                        <a
                            href="#pricing"
                            className="text-gray-300 hover:text-purple-400 transition"
                        >
                            Pricing
                        </a>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                    >
                        <span className="relative z-10">Launch App</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-full mb-8 hover:bg-purple-900/50 transition">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-purple-300">
                            ✨ Now Live - Free for Students
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                            Level Up
                        </span>
                        <br />
                        <span className="text-white">Your Student Life</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        The ultimate productivity hub for students. Manage
                        courses, track grades, plan exams, and build habits -
                        all synced with Google Calendar.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={handleLogin}
                            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                        >
                            <span className="relative z-10 flex items-center">
                                🚀 Start Free Now
                                <svg
                                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all hover:scale-105">
                            Watch Demo 🎥
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                15+
                            </div>
                            <div className="text-gray-400 text-sm">
                                Features
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                100%
                            </div>
                            <div className="text-gray-400 text-sm">Free</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                ∞
                            </div>
                            <div className="text-gray-400 text-sm">
                                Google Sync
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image/Illustration */}
                <div className="relative mt-20 max-w-6xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />

                    {/* 3D Card Effect */}
                    <div
                        className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 transform hover:scale-105 transition-all duration-500"
                        style={{
                            transform: `perspective(1000px) rotateX(${
                                mousePosition.y * 0.01
                            }deg) rotateY(${mousePosition.x * 0.01}deg)`,
                        }}
                    >
                        {/* Dashboard Preview */}
                        <div className="bg-[#1a0e3e] rounded-2xl p-6 space-y-4">
                            {/* Mock Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                                    <div>
                                        <div className="h-3 bg-gray-700 rounded w-24 mb-2" />
                                        <div className="h-2 bg-gray-800 rounded w-16" />
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="w-8 h-8 bg-purple-800/50 rounded-lg" />
                                    <div className="w-8 h-8 bg-pink-800/50 rounded-lg" />
                                </div>
                            </div>

                            {/* Mock Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
                                    >
                                        <div className="h-2 bg-gray-700 rounded w-16 mb-3" />
                                        <div className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded mb-2" />
                                        <div className="h-2 bg-gray-800 rounded w-full" />
                                    </div>
                                ))}
                            </div>

                            {/* Mock Chart */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                                <div className="flex items-end justify-between h-32">
                                    {[40, 70, 50, 90, 60, 80, 95].map(
                                        (height, i) => (
                                            <div
                                                key={i}
                                                className="w-8 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:scale-110"
                                                style={{ height: `${height}%` }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl animate-bounce">
                            🎯
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
                            ⚡
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div
                id="features"
                className="relative z-10 container mx-auto px-6 py-32"
            >
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-white mb-4">
                        Supercharge Your Productivity
                    </h2>
                    <p className="text-xl text-gray-400">
                        Everything you need, beautifully integrated
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: '🎓',
                            title: 'Course Manager',
                            desc: 'Auto-sync schedules to Google Calendar',
                            color: 'from-purple-600 to-pink-600',
                        },
                        {
                            icon: '📊',
                            title: 'Grade Tracker',
                            desc: 'Calculate GPA with weighted averages',
                            color: 'from-blue-600 to-cyan-600',
                        },
                        {
                            icon: '🎯',
                            title: 'Exam Planner',
                            desc: 'Countdown timers & study materials',
                            color: 'from-pink-600 to-purple-600',
                        },
                        {
                            icon: '💰',
                            title: 'Finance Tracker',
                            desc: 'Track income & expenses monthly',
                            color: 'from-green-600 to-emerald-600',
                        },
                        {
                            icon: '🔥',
                            title: 'Habit Builder',
                            desc: 'Daily habits with streak tracking',
                            color: 'from-orange-600 to-red-600',
                        },
                        {
                            icon: '🍅',
                            title: 'Pomodoro Timer',
                            desc: 'Focus sessions for productivity',
                            color: 'from-red-600 to-pink-600',
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl"
                        >
                            <div
                                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">{feature.desc}</p>

                            {/* Glow Effect */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-2xl`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 container mx-auto px-6 py-32">
                <div className="relative bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-16 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />

                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-white mb-6">
                            Ready to Level Up?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of students already crushing their
                            goals with StudenCal
                        </p>

                        <button
                            onClick={handleLogin}
                            className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-xl overflow-hidden transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
                        >
                            <span className="relative z-10 flex items-center">
                                Get Started Free
                                <svg
                                    className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-30" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-600 rounded-full blur-3xl opacity-30" />
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-purple-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-lg">📚</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                            StudenCal
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm">
                        Made with ❤️ for students everywhere
                    </p>
                </div>
            </footer>
        </div>
    );
}
