// components/pages/ModernDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ModernDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalCourses: 0,
        pendingTasks: 0,
        upcomingEvents: 0,
        averageGrade: 0,
    });
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [todayFocus, setTodayFocus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [userRes, coursesRes, tasksRes, gradesRes] =
                await Promise.all([
                    axios.get(`${API_URL}/auth/me`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/courses`, {
                        withCredentials: true,
                    }),
                    axios.get(`${API_URL}/api/tasks/upcoming`, {
                        withCredentials: true,
                    }),
                    axios.get(`${API_URL}/api/grades/summary`, {
                        withCredentials: true,
                    }),
                ]);

            setUser(userRes.data);
            setUpcomingTasks(tasksRes.data);

            const avgGrade =
                gradesRes.data.reduce(
                    (sum, g) => sum + parseFloat(g.averageScore || 0),
                    0
                ) / gradesRes.data.length || 0;

            setStats({
                totalCourses: coursesRes.data.length,
                pendingTasks: tasksRes.data.filter((t) => t.status !== 'Done')
                    .length,
                upcomingEvents: tasksRes.data.length,
                averageGrade: avgGrade.toFixed(1),
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-purple-300 text-lg">
                        Loading your universe...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-10 blur-3xl top-0 left-0 animate-pulse" />
                <div className="absolute w-96 h-96 rounded-full bg-pink-600 opacity-10 blur-3xl bottom-0 right-0 animate-pulse" />
                <div className="absolute w-72 h-72 rounded-full bg-blue-600 opacity-10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            {/* Header */}
            <header className="relative z-10 backdrop-blur-xl bg-purple-900/20 border-b border-purple-500/20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    StudenCal
                                </h1>
                                <p className="text-xs text-gray-400">
                                    Productivity Hub
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-2">
                            {[
                                {
                                    id: 'overview',
                                    icon: '🏠',
                                    label: 'Overview',
                                },
                                { id: 'courses', icon: '🎓', label: 'Courses' },
                                { id: 'tasks', icon: '✓', label: 'Tasks' },
                                { id: 'grades', icon: '📊', label: 'Grades' },
                                { id: 'finance', icon: '💰', label: 'Finance' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* User */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                                <span className="text-xl">🔔</span>
                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>

                            <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm">
                                        {user?.displayName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <span className="text-white text-sm font-medium hidden md:block">
                                    {user?.displayName?.split(' ')[0] ||
                                        'Student'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-black text-white mb-2">
                        Welcome back,{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {user?.displayName?.split(' ')[0] || 'Student'}
                        </span>
                        ! 👋
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Here's what's happening with your studies today
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            label: 'Active Courses',
                            value: stats.totalCourses,
                            icon: '🎓',
                            color: 'from-purple-600 to-pink-600',
                            bgColor: 'from-purple-900/20 to-pink-900/20',
                        },
                        {
                            label: 'Pending Tasks',
                            value: stats.pendingTasks,
                            icon: '📝',
                            color: 'from-blue-600 to-cyan-600',
                            bgColor: 'from-blue-900/20 to-cyan-900/20',
                        },
                        {
                            label: 'Upcoming Events',
                            value: stats.upcomingEvents,
                            icon: '📅',
                            color: 'from-pink-600 to-purple-600',
                            bgColor: 'from-pink-900/20 to-purple-900/20',
                        },
                        {
                            label: 'Average GPA',
                            value: stats.averageGrade,
                            icon: '⭐',
                            color: 'from-yellow-600 to-orange-600',
                            bgColor: 'from-yellow-900/20 to-orange-900/20',
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`group relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl overflow-hidden`}
                        >
                            {/* Glow Effect */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}
                            />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <svg
                                        className="w-6 h-6 text-gray-600 group-hover:text-purple-400 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>

                                <div
                                    className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                                >
                                    {stat.value}
                                </div>

                                <div className="text-gray-400 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Tasks & Focus */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Today's Focus */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center">
                                    <span className="mr-3">🎯</span>
                                    Today's Focus
                                </h3>
                                <button className="text-purple-400 hover:text-purple-300 text-sm">
                                    View All →
                                </button>
                            </div>

                            <div className="space-y-4">
                                {upcomingTasks.slice(0, 3).map((task, i) => (
                                    <div
                                        key={i}
                                        className="group bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-102"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                                    {task.title}
                                                </h4>
                                                {task.courseId && (
                                                    <span className="inline-block px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-xs">
                                                        {
                                                            task.courseId
                                                                .courseName
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-400 mb-1">
                                                    Deadline
                                                </div>
                                                <div className="text-purple-300 font-semibold text-sm">
                                                    {new Date(
                                                        task.deadline
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        {task.subtasks &&
                                            task.subtasks.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                        <span>Progress</span>
                                                        <span>
                                                            {task
                                                                .subtaskProgress
                                                                ?.percentage ||
                                                                0}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${
                                                                    task
                                                                        .subtaskProgress
                                                                        ?.percentage ||
                                                                    0
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                ))}

                                {upcomingTasks.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <p className="text-gray-400">
                                            No pending tasks! Great job!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Chart */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <span className="mr-3">📈</span>
                                Weekly Activity
                            </h3>

                            <div className="flex items-end justify-between h-48">
                                {[
                                    'Mon',
                                    'Tue',
                                    'Wed',
                                    'Thu',
                                    'Fri',
                                    'Sat',
                                    'Sun',
                                ].map((day, i) => {
                                    const height = Math.random() * 100;
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 flex flex-col items-center"
                                        >
                                            <div
                                                className="w-full px-1 flex items-end justify-center mb-2"
                                                style={{ height: '12rem' }}
                                            >
                                                <div
                                                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t-lg hover:scale-110 transition-all cursor-pointer"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium">
                                                {day}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Upcoming & Quick Actions */}
                    <div className="space-y-8">
                        {/* Upcoming Exams */}
                        <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <span className="mr-2">🎯</span>
                                Upcoming Exams
                            </h3>

                            <div className="space-y-3">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-gradient-to-r from-red-800/20 to-pink-800/20 rounded-xl p-4 border border-red-500/20"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-white font-semibold text-sm">
                                                Final Exam
                                            </h4>
                                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">
                                                H-{3 + i}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            Calculus II
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Quick Actions
                            </h3>

                            <div className="space-y-3">
                                {[
                                    {
                                        icon: '📚',
                                        label: 'Add Course',
                                        color: 'from-purple-600 to-pink-600',
                                    },
                                    {
                                        icon: '✓',
                                        label: 'New Task',
                                        color: 'from-blue-600 to-cyan-600',
                                    },
                                    {
                                        icon: '💰',
                                        label: 'Add Transaction',
                                        color: 'from-green-600 to-emerald-600',
                                    },
                                    {
                                        icon: '🎯',
                                        label: 'Schedule Exam',
                                        color: 'from-red-600 to-pink-600',
                                    },
                                ].map((action, i) => (
                                    <button
                                        key={i}
                                        className={`w-full group bg-gradient-to-r ${action.color} rounded-xl p-4 text-white font-semibold hover:scale-105 transition-all hover:shadow-lg flex items-center justify-between`}
                                    >
                                        <span className="flex items-center">
                                            <span className="text-2xl mr-3">
                                                {action.icon}
                                            </span>
                                            {action.label}
                                        </span>
                                        <svg
                                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
