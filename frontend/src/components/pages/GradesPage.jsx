// components/GradesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function GradesPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [gradeData, setGradeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [summary, setSummary] = useState([]);
    const [formData, setFormData] = useState({
        componentName: '',
        score: '',
        maxScore: 100,
        weight: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [coursesRes, summaryRes] = await Promise.all([
                axios.get(`${API_URL}/api/courses`, { withCredentials: true }),
                axios.get(`${API_URL}/api/grades/summary`, {
                    withCredentials: true,
                }),
            ]);

            setCourses(coursesRes.data);
            setSummary(summaryRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchCourseGrades = async (courseId) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/grades/course/${courseId}`,
                { withCredentials: true }
            );
            setGradeData(response.data);
            setSelectedCourse(courseId);
        } catch (error) {
            alert('Error loading grades: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            alert('Please select a course first');
            return;
        }

        try {
            const payload = {
                ...formData,
                courseId: selectedCourse,
                score: parseFloat(formData.score),
                maxScore: parseFloat(formData.maxScore),
                weight: parseFloat(formData.weight),
            };

            if (editingGrade) {
                await axios.put(
                    `${API_URL}/api/grades/${editingGrade._id}`,
                    payload,
                    { withCredentials: true }
                );
                alert('✅ Grade updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/grades`, payload, {
                    withCredentials: true,
                });
                alert('✅ Grade added successfully!');
            }

            setShowModal(false);
            setEditingGrade(null);
            resetForm();
            fetchCourseGrades(selectedCourse);
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.response?.data?.error || error.message);
        }
    };

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setFormData({
            componentName: grade.componentName,
            score: grade.score,
            maxScore: grade.maxScore,
            weight: grade.weight,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this grade?')) return;

        try {
            await axios.delete(`${API_URL}/api/grades/${id}`, {
                withCredentials: true,
            });
            alert('✅ Grade deleted successfully!');
            fetchCourseGrades(selectedCourse);
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            componentName: '',
            score: '',
            maxScore: 100,
            weight: '',
        });
    };

    const getLetterGradeColor = (grade) => {
        if (['A', 'A-'].includes(grade)) return 'text-green-600 bg-green-100';
        if (['B+', 'B', 'B-'].includes(grade))
            return 'text-blue-600 bg-blue-100';
        if (['C+', 'C'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
        if (grade === 'D') return 'text-orange-600 bg-orange-100';
        if (grade === 'E') return 'text-red-600 bg-red-100';
        return 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading grades...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📊 Pelacak Nilai
                    </h1>
                    <p className="text-gray-600">
                        Track your grades and calculate your GPA
                    </p>
                </div>

                {/* Course Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {summary.map((item) => (
                        <div
                            key={item.courseId}
                            onClick={() => fetchCourseGrades(item.courseId)}
                            className={`bg-white rounded-lg shadow p-6 cursor-pointer transition hover:shadow-lg ${
                                selectedCourse === item.courseId
                                    ? 'ring-2 ring-blue-500'
                                    : ''
                            }`}
                        >
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {item.courseName}
                            </h3>
                            {item.courseCode && (
                                <p className="text-sm text-gray-500 mb-3">
                                    {item.courseCode}
                                </p>
                            )}

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {item.averageScore}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xl font-bold ${getLetterGradeColor(
                                        item.letterGrade
                                    )}`}
                                >
                                    {item.letterGrade}
                                </span>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex justify-between">
                                    <span>Components:</span>
                                    <span className="font-medium">
                                        {item.componentsCount}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Weight:</span>
                                    <span className="font-medium">
                                        {item.totalWeight}%
                                    </span>
                                </div>
                            </div>

                            {!item.isComplete && (
                                <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                                    ⚠️ Incomplete (need {100 - item.totalWeight}
                                    % more)
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Selected Course Details */}
                {gradeData && (
                    <div className="bg-white rounded-lg shadow">
                        {/* Course Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {gradeData.course.courseName}
                                    </h2>
                                    {gradeData.course.courseCode && (
                                        <p className="text-gray-500">
                                            {gradeData.course.courseCode}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingGrade(null);
                                        resetForm();
                                        setShowModal(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    ➕ Add Grade
                                </button>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Current Average
                                    </p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {gradeData.statistics.averageScore}
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Letter Grade
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${
                                            getLetterGradeColor(
                                                gradeData.statistics.letterGrade
                                            ).split(' ')[0]
                                        }`}
                                    >
                                        {gradeData.statistics.letterGrade}
                                    </p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Total Weight
                                    </p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {gradeData.statistics.totalWeight}%
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Components
                                    </p>
                                    <p className="text-3xl font-bold text-gray-600">
                                        {gradeData.statistics.componentsCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grades Table */}
                        <div className="p-6">
                            {gradeData.grades.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">
                                        📝
                                    </span>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No Grades Yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Start tracking your grades for this
                                        course
                                    </p>
                                </div>
                            ) : (
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                                                Component
                                            </th>
                                            <th className="text-center py-3 px-4 font-medium text-gray-700">
                                                Score
                                            </th>
                                            <th className="text-center py-3 px-4 font-medium text-gray-700">
                                                Percentage
                                            </th>
                                            <th className="text-center py-3 px-4 font-medium text-gray-700">
                                                Weight
                                            </th>
                                            <th className="text-center py-3 px-4 font-medium text-gray-700">
                                                Contribution
                                            </th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeData.grades.map((grade) => {
                                            const percentage =
                                                (grade.score / grade.maxScore) *
                                                100;
                                            const contribution =
                                                (percentage * grade.weight) /
                                                100;

                                            return (
                                                <tr
                                                    key={grade._id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className="font-medium text-gray-900">
                                                            {
                                                                grade.componentName
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="text-gray-900">
                                                            {grade.score} /{' '}
                                                            {grade.maxScore}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span
                                                            className={`font-semibold ${
                                                                percentage >= 85
                                                                    ? 'text-green-600'
                                                                    : percentage >=
                                                                      70
                                                                    ? 'text-blue-600'
                                                                    : percentage >=
                                                                      60
                                                                    ? 'text-yellow-600'
                                                                    : 'text-red-600'
                                                            }`}
                                                        >
                                                            {percentage.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="text-gray-900">
                                                            {grade.weight}%
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="font-medium text-gray-900">
                                                            {contribution.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    grade
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    grade._id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!selectedCourse && summary.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <span className="text-6xl mb-4 block">🎓</span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Courses Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Add courses first to start tracking grades
                        </p>
                        <a
                            href="/courses"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to Courses
                        </a>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingGrade ? 'Edit Grade' : 'Add Grade'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Component Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.componentName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                componentName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tugas 1, UTS, Quiz 2, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Score *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.score}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    score: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="85"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Score *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.maxScore}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    maxScore: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight (%) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                weight: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="20"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Remaining weight:{' '}
                                        {gradeData
                                            ? 100 -
                                              gradeData.statistics.totalWeight
                                            : 100}
                                        %
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        {editingGrade ? 'Update' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingGrade(null);
                                            resetForm();
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
