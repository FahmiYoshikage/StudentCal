// frontend/src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext.jsx';
import ModernNavbar from './ModernNavbar';
import PomodoroTimer from '../widgets/PomodoroTimer';

const DashboardLayout = () => {
    const { user, logout, loading } = useAuthContext();

    // Redirect ke home jika belum login
    React.useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/';
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-purple-300 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e]">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-10 blur-3xl top-0 left-0 animate-pulse" />
                <div className="absolute w-96 h-96 rounded-full bg-pink-600 opacity-10 blur-3xl bottom-0 right-0 animate-pulse" />
            </div>

            {/* Navbar */}
            <ModernNavbar user={user} onLogout={logout} />

            {/* Page Content */}
            <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Pomodoro Timer */}
            <PomodoroTimer />
        </div>
    );
};

export default DashboardLayout;
