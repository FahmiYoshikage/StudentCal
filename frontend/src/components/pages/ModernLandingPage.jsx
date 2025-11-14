// components/pages/ModernLandingPage.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generate random stars
const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
    }));
};

export default function ModernLandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [stars] = useState(generateStars(150));

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
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Floating Orbs with Mouse Parallax */}
                <div
                    className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl transition-all duration-300 ease-out"
                    style={{
                        left: '20%',
                        top: '20%',
                        transform: `translate(${mousePosition.x * 0.02}px, ${
                            mousePosition.y * 0.02
                        }px)`,
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full bg-pink-500 opacity-20 blur-3xl transition-all duration-300 ease-out"
                    style={{
                        right: '20%',
                        bottom: '20%',
                        transform: `translate(${-mousePosition.x * 0.01}px, ${
                            -mousePosition.y * 0.01
                        }px)`,
                    }}
                />

                {/* Twinkling Stars */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDuration: `${star.duration}s`,
                            animationDelay: `${star.delay}s`,
                            boxShadow: `0 0 ${
                                star.size * 2
                            }px rgba(255, 255, 255, 0.5)`,
                        }}
                    />
                ))}

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

            {/* Navigation - Fixed & Sticky */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-md border-b border-purple-500/10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                StudentCal
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            <a
                                href="#about"
                                className="relative text-gray-300 hover:text-purple-400 transition-all group"
                            >
                                <span>About</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#features"
                                className="relative text-gray-300 hover:text-purple-400 transition-all group"
                            >
                                <span>Features</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#benefits"
                                className="relative text-gray-300 hover:text-purple-400 transition-all group"
                            >
                                <span>Benefits</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#guide"
                                className="relative text-gray-300 hover:text-purple-400 transition-all group"
                            >
                                <span>Guide</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm sm:text-base font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                        >
                            <span className="relative z-10">🚀 Launch App</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-full hover:bg-purple-900/50 transition">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-xs sm:text-sm text-purple-300">
                                    ✨ Now Live - Free for Students
                                </span>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                Level Up
                            </span>
                            <br />
                            <span className="text-white">
                                Your Student Life
                            </span>
                        </h1>

                        <div className="flex justify-center">
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl leading-relaxed">
                                The ultimate productivity hub for students.
                                Manage courses, track grades, plan exams, and
                                build habits - all synced with Google Calendar.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16">
                            <button
                                onClick={handleLogin}
                                className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-base sm:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                            >
                                <span className="relative z-10 flex items-center justify-center">
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

                            <a
                                href="#guide"
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all hover:scale-105 text-center"
                            >
                                Learn More 📖
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mb-12 sm:mb-16">
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    15+
                                </div>
                                <div className="text-gray-400 text-xs sm:text-sm">
                                    Features
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    100%
                                </div>
                                <div className="text-gray-400 text-xs sm:text-sm">
                                    Free
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    ∞
                                </div>
                                <div className="text-gray-400 text-xs sm:text-sm">
                                    Google Sync
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Illustration - 3D Dashboard Preview */}
                        <div className="relative mt-20 max-w-6xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />

                            {/* 3D Card Effect with Mouse Movement */}
                            <div
                                className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6 sm:p-8 transition-all duration-300"
                                style={{
                                    transform: `perspective(1000px) rotateX(${
                                        (mousePosition.y -
                                            window.innerHeight / 2) *
                                        0.01
                                    }deg) rotateY(${
                                        (mousePosition.x -
                                            window.innerWidth / 2) *
                                        0.01
                                    }deg)`,
                                }}
                            >
                                {/* Dashboard Preview */}
                                <div className="bg-[#1a0e3e] rounded-2xl p-4 sm:p-6 space-y-4">
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
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-xl p-3 sm:p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
                                            >
                                                <div className="h-2 bg-gray-700 rounded w-12 sm:w-16 mb-3" />
                                                <div className="h-6 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded mb-2" />
                                                <div className="h-2 bg-gray-800 rounded w-full" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock Chart */}
                                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 sm:p-6 border border-purple-500/20">
                                        <div className="flex items-end justify-between h-24 sm:h-32">
                                            {[40, 70, 50, 90, 60, 80, 95].map(
                                                (height, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-6 sm:w-8 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:scale-110"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl animate-bounce">
                                    🎯
                                </div>
                                <div className="absolute -bottom-6 -left-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl animate-pulse">
                                    ⚡
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                className="relative z-10 w-full py-24 sm:py-32 md:py-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20 md:mb-24">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8">
                            Kenapa StudentCal? 🤔
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                                Platform all-in-one yang dirancang khusus untuk
                                mahasiswa Indonesia
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
                        <div className="group bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-purple-500/40 hover:border-purple-500/60 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20">
                            <div className="text-5xl sm:text-6xl mb-6">😫</div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                                Problem
                            </h3>
                            <ul className="text-base sm:text-lg text-gray-300 space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">📝</span>
                                    <span>
                                        Jadwal kuliah berantakan di banyak
                                        aplikasi
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">📊</span>
                                    <span>Susah track IPK dan nilai</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">💸</span>
                                    <span>
                                        Uang saku habis nggak jelas kemana
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">📚</span>
                                    <span>
                                        Deadline tugas sering ketinggalan
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">😴</span>
                                    <span>Sulit maintain habit produktif</span>
                                </li>
                            </ul>
                        </div>

                        <div className="group bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-blue-500/40 hover:border-blue-500/60 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20">
                            <div className="text-5xl sm:text-6xl mb-6">✨</div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                                Solution
                            </h3>
                            <ul className="text-base sm:text-lg text-gray-300 space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">📱</span>
                                    <span>
                                        Satu dashboard untuk semua kebutuhan
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">🔄</span>
                                    <span>
                                        Auto-sync dengan Google Calendar
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">📈</span>
                                    <span>
                                        Tracking otomatis IPK & keuangan
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">⏰</span>
                                    <span>Reminder cerdas untuk deadline</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-xl">🎯</span>
                                    <span>Habit tracker dengan gamifikasi</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="relative z-10 w-full py-24 sm:py-32 md:py-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20 md:mb-24">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8">
                            ⚡ Fitur Lengkap untuk Mahasiswa
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                                Semua yang kamu butuhkan, dalam satu platform
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
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
                                className="group relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl"
                            >
                                <div
                                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400">
                                    {feature.desc}
                                </p>

                                {/* Glow Effect */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-2xl`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section
                id="benefits"
                className="relative z-10 w-full py-24 sm:py-32 md:py-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20 md:mb-24">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8">
                            🎯 Manfaat untuk Mahasiswa
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                                Rasakan perbedaannya dalam kehidupan kuliahmu
                            </p>
                        </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
                        {[
                            {
                                icon: '⏱️',
                                title: 'Hemat Waktu',
                                desc: 'Tidak perlu buka banyak aplikasi. Semua terpusat di satu tempat.',
                                color: 'from-purple-600 to-pink-600',
                            },
                            {
                                icon: '📈',
                                title: 'Naik IPK',
                                desc: 'Tracking nilai otomatis membantu kamu fokus pada mata kuliah yang perlu ditingkatkan.',
                                color: 'from-blue-600 to-cyan-600',
                            },
                            {
                                icon: '💰',
                                title: 'Manage Keuangan',
                                desc: 'Tau kemana uang saku habis. Bisa planning lebih baik.',
                                color: 'from-green-600 to-emerald-600',
                            },
                            {
                                icon: '🏆',
                                title: 'Produktif Maksimal',
                                desc: 'Habit tracker & Pomodoro timer bikin kamu konsisten dan fokus.',
                                color: 'from-orange-600 to-red-600',
                            },
                        ].map((benefit, i) => (
                            <div
                                key={i}
                                className="group relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
                            >
                                <div className="flex items-start space-x-4">
                                    <div
                                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center text-2xl sm:text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all`}
                                    >
                                        {benefit.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-400">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Use Guide */}
            <section
                id="guide"
                className="relative z-10 w-full py-24 sm:py-32 md:py-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16 sm:mb-20 md:mb-24">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8">
                            📖 Cara Pakai StudentCal
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                                Mulai dalam 3 langkah mudah
                            </p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 mb-12 sm:mb-16">
                        {[
                            {
                                step: '1',
                                title: 'Login dengan Google',
                                desc: 'Klik "Launch App" dan login pakai akun Google kamu. Aman dan cepat!',
                                icon: '🔐',
                            },
                            {
                                step: '2',
                                title: 'Setup Profil & Courses',
                                desc: 'Tambahkan mata kuliah, jadwal, dan informasi semester kamu. Otomatis sync ke Google Calendar.',
                                icon: '📚',
                            },
                            {
                                step: '3',
                                title: 'Mulai Tracking!',
                                desc: 'Catat nilai, expenses, tasks, dan habits. Dashboard otomatis update statistik kamu.',
                                icon: '🚀',
                            },
                        ].map((step, i) => (
                            <div
                                key={i}
                                className="group relative bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
                            >
                                <div className="flex items-start space-x-4 sm:space-x-6">
                                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black text-white">
                                        {step.step}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                                            <span className="text-2xl sm:text-3xl">
                                                {step.icon}
                                            </span>
                                            <h3 className="text-xl sm:text-2xl font-bold text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-400">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Tips */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-blue-500/20 max-w-4xl mx-auto">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="text-2xl sm:text-3xl mr-3">
                                💡
                            </span>
                            Tips Pro
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                            <li className="flex items-start">
                                <span className="text-blue-400 mr-2">•</span>
                                Gunakan Pomodoro Timer saat belajar untuk fokus
                                maksimal (25 menit fokus, 5 menit break)
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-400 mr-2">•</span>
                                Set habit daily seperti "Baca materi" atau
                                "Olahraga" untuk build konsistensi
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-400 mr-2">•</span>
                                Review Finance Tracker tiap akhir bulan untuk
                                budgeting bulan depan
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-400 mr-2">•</span>
                                Enable notifikasi Google Calendar supaya nggak
                                miss deadline
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 w-full py-24 sm:py-32 md:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-purple-500/40 p-12 sm:p-16 md:p-20 text-center overflow-hidden max-w-5xl mx-auto shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8">
                                Siap Level Up? 🚀
                            </h2>
                            <div className="flex justify-center mb-10 sm:mb-12">
                                <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                                    Gabung dengan ribuan mahasiswa yang sudah
                                    merasakan manfaat StudentCal. 100% Gratis!
                                </p>
                            </div>

                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={handleLogin}
                                    className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-base sm:text-lg md:text-xl overflow-hidden transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        Mulai Sekarang Gratis
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-2 transition-transform"
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

                            <p className="text-sm sm:text-base text-gray-400">
                                ✓ Tanpa kartu kredit ✓ Setup dalam 2 menit ✓
                                Selamanya gratis
                            </p>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-600 rounded-full blur-3xl opacity-30" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-pink-600 rounded-full blur-3xl opacity-30" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📚</span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-white">
                                StudentCal
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <a
                                href="#about"
                                className="hover:text-purple-400 transition"
                            >
                                About
                            </a>
                            <a
                                href="#features"
                                className="hover:text-purple-400 transition"
                            >
                                Features
                            </a>
                            <a
                                href="#benefits"
                                className="hover:text-purple-400 transition"
                            >
                                Benefits
                            </a>
                            <a
                                href="#guide"
                                className="hover:text-purple-400 transition"
                            >
                                Guide
                            </a>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-400 text-center">
                            Made with ❤️ for Indonesian Students
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
