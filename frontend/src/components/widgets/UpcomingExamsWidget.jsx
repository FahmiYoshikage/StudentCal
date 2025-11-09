// components/UpcomingExamsWidget.jsx
// Add this to Dashboard
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function UpcomingExamsWidget() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingExams();
    }, []);

    const fetchUpcomingExams = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/exams/upcoming`, {
                withCredentials: true,
            });
            setExams(response.data.slice(0, 2)); // Only show 2
            setLoading(false);
        } catch (error) {
            console.error('Error fetching upcoming exams:', error);
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        );

    if (exams.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <span className="text-4xl mb-2 block">✅</span>
                <p className="text-gray-600 text-sm">No upcoming exams</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
                🎯 Ujian Mendatang
            </h3>
            <div className="space-y-3">
                {exams.map((exam) => {
                    const badge =
                        exam.daysUntil === 0
                            ? 'HARI INI!'
                            : exam.daysUntil === 1
                            ? 'BESOK!'
                            : `H-${exam.daysUntil}`;

                    const badgeColor =
                        exam.daysUntil <= 1
                            ? 'bg-red-500 text-white'
                            : exam.daysUntil <= 7
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-100 text-blue-800';

                    return (
                        <div
                            key={exam._id}
                            className="border-l-4 border-red-500 bg-red-50 p-3 rounded"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-gray-900 text-sm">
                                    {exam.examName}
                                </h4>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded font-bold ${badgeColor}`}
                                >
                                    {badge}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600">
                                📚 {exam.courseId.courseName}
                            </p>
                            <p className="text-xs text-gray-500">
                                📅{' '}
                                {new Date(exam.examDate).toLocaleDateString(
                                    'id-ID',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }
                                )}
                            </p>
                        </div>
                    );
                })}
            </div>
            <a
                href="/exams"
                className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
                Lihat Semua Ujian →
            </a>
        </div>
    );
}
