// components/TodaysFocusWidget.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DAYS_MAP = {
    0: 7, // Sunday
    1: 1, // Monday
    2: 2, // Tuesday
    3: 3, // Wednesday
    4: 4, // Thursday
    5: 5, // Friday
    6: 6, // Saturday
};

export default function TodaysFocusWidget() {
    const [todaysCourses, setTodaysCourses] = useState([]);
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodaysFocus();
    }, []);

    const fetchTodaysFocus = async () => {
        try {
            setLoading(true);

            // Get current day (1-7, Monday-Sunday)
            const today = new Date();
            const dayOfWeek = DAYS_MAP[today.getDay()];

            // Get today's date range
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            // Fetch courses and tasks
            const [coursesRes, tasksRes] = await Promise.all([
                axios.get(`${API_URL}/api/courses`, { withCredentials: true }),
                axios.get(`${API_URL}/api/tasks`, { withCredentials: true }),
            ]);

            // Filter today's courses
            const courses = coursesRes.data
                .filter((course) => course.dayOfWeek === dayOfWeek)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

            // Filter today's tasks (deadline is today)
            const tasks = tasksRes.data
                .filter((task) => {
                    const deadline = new Date(task.deadline);
                    return (
                        deadline >= startOfDay &&
                        deadline <= endOfDay &&
                        task.status !== 'Done'
                    );
                })
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

            setTodaysCourses(courses);
            setTodaysTasks(tasks);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching today's focus:", error);
            setLoading(false);
        }
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5); // "10:30:00" -> "10:30"
    };

    const getTimeUntil = (startTime) => {
        const now = new Date();
        const [hours, minutes] = startTime.split(':');
        const courseTime = new Date();
        courseTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const diff = courseTime - now;
        const diffMinutes = Math.floor(diff / 60000);

        if (diffMinutes < 0) return 'Started';
        if (diffMinutes < 60) return `in ${diffMinutes} min`;
        const diffHours = Math.floor(diffMinutes / 60);
        return `in ${diffHours}h ${diffMinutes % 60}m`;
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
        );
    }

    const hasNoSchedule =
        todaysCourses.length === 0 && todaysTasks.length === 0;

    if (hasNoSchedule) {
        return (
            <div className="text-center py-8">
                <span className="text-5xl mb-3 block">☀️</span>
                <p className="text-xl font-semibold mb-2">
                    Tidak ada jadwal atau tugas hari ini
                </p>
                <p className="text-blue-100">Selamat bersantai! 🎉</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Classes */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                    🎓 Jadwal Kuliah Hari Ini
                </h3>

                {todaysCourses.length === 0 ? (
                    <p className="text-blue-100 text-sm">
                        Tidak ada kuliah hari ini
                    </p>
                ) : (
                    <div className="space-y-3">
                        {todaysCourses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white bg-opacity-30 rounded-lg p-3 backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-sm">
                                        {course.courseName}
                                    </h4>
                                    <span className="text-xs bg-white bg-opacity-40 px-2 py-0.5 rounded">
                                        {getTimeUntil(course.startTime)}
                                    </span>
                                </div>
                                <p className="text-xs text-blue-100 mb-1">
                                    📍 {course.location || 'No location'}
                                </p>
                                <p className="text-sm font-semibold">
                                    ⏰ {formatTime(course.startTime)} -{' '}
                                    {formatTime(course.endTime)}
                                </p>
                                <p className="text-xs text-blue-100 mt-1">
                                    👨‍🏫 {course.lecturerName}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Today's Deadlines */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                    📝 Deadline Hari Ini
                </h3>

                {todaysTasks.length === 0 ? (
                    <p className="text-blue-100 text-sm">
                        Tidak ada deadline hari ini
                    </p>
                ) : (
                    <div className="space-y-3">
                        {todaysTasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-white bg-opacity-30 rounded-lg p-3 backdrop-blur-sm"
                            >
                                <h4 className="font-medium text-sm mb-1">
                                    {task.title}
                                </h4>
                                {task.courseId && (
                                    <p className="text-xs text-blue-100 mb-1">
                                        📚 {task.courseId.courseName}
                                    </p>
                                )}
                                <p className="text-sm font-semibold">
                                    ⏰{' '}
                                    {new Date(task.deadline).toLocaleTimeString(
                                        'id-ID',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )}
                                </p>
                                <div className="mt-2">
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            task.status === 'Todo'
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Add this import to Dashboard.jsx at the top:
// import TodaysFocusWidget from './TodaysFocusWidget';
