// components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        pendingTasks: 0,
        upcomingEvents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch user info
            const userRes = await axios.get(`${API_URL}/auth/me`, {
                withCredentials: true,
            });
            setUser(userRes.data);

            // Fetch calendar events
            const now = new Date();
            const sixMonthsLater = new Date();
            sixMonthsLater.setMonth(now.getMonth() + 6);

            const eventsRes = await axios.get(
                `${API_URL}/api/calendar/events?start=${now.toISOString()}&end=${sixMonthsLater.toISOString()}`,
                { withCredentials: true }
            );
            setEvents(eventsRes.data);

            // Fetch upcoming tasks
            const tasksRes = await axios.get(`${API_URL}/api/tasks/upcoming`, {
                withCredentials: true,
            });
            setUpcomingTasks(tasksRes.data);

            // Fetch statistics
            const coursesRes = await axios.get(`${API_URL}/api/courses`, {
                withCredentials: true,
            });

            const allTasksRes = await axios.get(
                `${API_URL}/api/tasks?status=Todo`,
                {
                    withCredentials: true,
                }
            );

            setStats({
                totalCourses: coursesRes.data.length,
                pendingTasks: allTasksRes.data.length,
                upcomingEvents: eventsRes.data.length,
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);

            // Redirect to login if not authenticated
            if (error.response?.status === 401) {
                window.location.href = `${API_URL}/auth/google`;
            }
        }
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue!';
        if (diffDays === 0) return 'Today!';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays <= 7) return `${diffDays} days`;
        return date.toLocaleDateString('id-ID');
    };

    const getDeadlineColor = (deadline) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 font-bold';
        if (diffDays <= 1) return 'text-orange-600 font-semibold';
        if (diffDays <= 7) return 'text-yellow-600';
        return 'text-gray-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                📚 StudenCal
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Hi, {user?.displayName || 'Student'}
                            </span>
                            {user?.avatarUrl && (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">
                                    Total Mata Kuliah
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats.totalCourses}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">
                                    Tugas Pending
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats.pendingTasks}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">
                                    Event Mendatang
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats.upcomingEvents}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar - Takes 2/3 width */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Kalender Akademik
                            </h2>
                            <FullCalendar
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                ]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                events={events}
                                height="auto"
                                locale="id"
                                buttonText={{
                                    today: 'Hari Ini',
                                    month: 'Bulan',
                                    week: 'Minggu',
                                    day: 'Hari',
                                }}
                                eventClick={(info) => {
                                    alert(
                                        `Event: ${info.event.title}\n${info.event.start}`
                                    );
                                }}
                            />
                        </div>
                    </div>

                    {/* Upcoming Tasks Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Tugas Mendatang
                            </h2>

                            {upcomingTasks.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-2 block">
                                        🎉
                                    </span>
                                    <p className="text-gray-500">
                                        Tidak ada tugas pending!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className="border-l-4 border-blue-500 bg-gray-50 p-3 rounded"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-medium text-gray-900 text-sm">
                                                    {task.title}
                                                </h3>
                                                <span
                                                    className={`text-xs ${getDeadlineColor(
                                                        task.deadline
                                                    )}`}
                                                >
                                                    {formatDeadline(
                                                        task.deadline
                                                    )}
                                                </span>
                                            </div>
                                            {task.courseId && (
                                                <p className="text-xs text-gray-500">
                                                    {task.courseId.courseName}
                                                </p>
                                            )}
                                            <div className="mt-2">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                        task.status === 'Todo'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : task.status ===
                                                              'In Progress'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 space-y-2">
                                <a
                                    href="/courses"
                                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    📚 Kelola Mata Kuliah
                                </a>
                                <a
                                    href="/tasks"
                                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    ✍️ Kelola Tugas
                                </a>
                                <a
                                    href="/events"
                                    className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    📅 Kelola Acara
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
