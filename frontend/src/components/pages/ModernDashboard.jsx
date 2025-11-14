// components/pages/ModernDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import ModernNavbar from '../layout/ModernNavbar';
import PomodoroTimer from '../widgets/PomodoroTimer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ModernDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();

    const [stats, setStats] = useState({
        totalCourses: 0,
        pendingTasks: 0,
        upcomingEvents: 0,
        averageGrade: 0,
    });
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Mock data for now (backend not running)
            // TODO: Replace with actual API calls when backend is ready

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Mock data
            setStats({
                totalCourses: 6,
                pendingTasks: 12,
                upcomingEvents: 5,
                averageGrade: 3.75,
            });

            setUpcomingTasks([
                {
                    title: 'Complete Data Structures Assignment',
                    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    courseId: { courseName: 'Data Structures' },
                    subtasks: [
                        { completed: true },
                        { completed: true },
                        { completed: false },
                        { completed: false },
                    ],
                    subtaskProgress: {
                        completed: 2,
                        total: 4,
                        percentage: 50,
                    },
                },
                {
                    title: 'Prepare Calculus Presentation',
                    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    courseId: { courseName: 'Calculus II' },
                    subtasks: [{ completed: true }, { completed: false }],
                    subtaskProgress: {
                        completed: 1,
                        total: 2,
                        percentage: 50,
                    },
                },
                {
                    title: 'Study for Physics Quiz',
                    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                    courseId: { courseName: 'Physics' },
                    subtasks: [],
                    subtaskProgress: null,
                },
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set mock data even on error (for development)
            setStats({
                totalCourses: 6,
                pendingTasks: 12,
                upcomingEvents: 5,
                averageGrade: 3.75,
            });
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
        <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#1a0e3e] to-[#2d1b5e]">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-10 blur-3xl top-0 left-0 animate-pulse" />
                <div className="absolute w-96 h-96 rounded-full bg-pink-600 opacity-10 blur-3xl bottom-0 right-0 animate-pulse" />
                <div className="absolute w-72 h-72 rounded-full bg-blue-600 opacity-10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            {/* Use Shared ModernNavbar Component */}
            <ModernNavbar user={user} onLogout={logout} />

            {/* Main Content - CENTERED */}
            <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section - CENTERED */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                            Welcome back,{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {user?.name?.split(' ')[0] || 'Student'}
                            </span>
                            ! 👋
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Here's what's happening with your studies today
                        </p>
                    </div>

                    {/* Stats Cards - CENTERED */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

                    {/* Main Grid - CENTERED */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Today's Focus */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white flex items-center">
                                        <span className="mr-3">🎯</span>
                                        Today's Focus
                                    </h3>
                                    <button
                                        onClick={() => navigate('/tasks')}
                                        className="text-purple-400 hover:text-purple-300 text-sm"
                                    >
                                        View All →
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {upcomingTasks
                                        .slice(0, 3)
                                        .map((task, i) => (
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
                                                                    task
                                                                        .courseId
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

                                                {task.subtasks &&
                                                    task.subtasks.length >
                                                        0 && (
                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                                <span>
                                                                    Progress
                                                                </span>
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
                                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
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
                                            <div className="text-6xl mb-4">
                                                🎉
                                            </div>
                                            <p className="text-gray-400">
                                                No pending tasks! Great job!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Weekly Activity Chart */}
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

                        {/* Quick Actions & Upcoming Exams */}
                        <div className="space-y-8">
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
                                            path: '/courses',
                                            color: 'from-purple-600 to-pink-600',
                                        },
                                        {
                                            icon: '✓',
                                            label: 'New Task',
                                            path: '/tasks',
                                            color: 'from-blue-600 to-cyan-600',
                                        },
                                        {
                                            icon: '💰',
                                            label: 'Add Transaction',
                                            path: '/finance',
                                            color: 'from-green-600 to-emerald-600',
                                        },
                                        {
                                            icon: '🎯',
                                            label: 'Schedule Exam',
                                            path: '/exams',
                                            color: 'from-red-600 to-pink-600',
                                        },
                                    ].map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                navigate(action.path)
                                            }
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
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Pomodoro Timer Widget */}
            <PomodoroTimer />
        </div>
    );
}
