// ============================================
// frontend/src/components/forms/GradeForm.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import coursesService from '../../services/coursesService';

const GradeForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: initialData.courseId?._id || initialData.courseId || '',
        componentName: initialData.componentName || '',
        score: initialData.score || '',
        maxScore: initialData.maxScore || 100,
        weight: initialData.weight || '',
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await coursesService.getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate weight
        if (parseFloat(formData.weight) > 100) {
            alert('Weight cannot exceed 100%');
            return;
        }

        // Validate score
        if (parseFloat(formData.score) > parseFloat(formData.maxScore)) {
            alert('Score cannot exceed max score');
            return;
        }

        onSubmit(formData);
    };

    const percentage =
        formData.score && formData.maxScore
            ? ((formData.score / formData.maxScore) * 100).toFixed(1)
            : 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Course *
                </label>
                <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                    <option value="" className="bg-gray-900">
                        Select a course
                    </option>
                    {courses.map((course) => (
                        <option
                            key={course._id}
                            value={course._id}
                            className="bg-gray-900"
                        >
                            {course.courseCode} - {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Component Name */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Component Name *
                </label>
                <input
                    type="text"
                    name="componentName"
                    value={formData.componentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="e.g., Quiz 1, Midterm, Final Project"
                />
            </div>

            {/* Score & Max Score */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Score *
                    </label>
                    <input
                        type="number"
                        name="score"
                        value={formData.score}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="85"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Max Score *
                    </label>
                    <input
                        type="number"
                        name="maxScore"
                        value={formData.maxScore}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="100"
                    />
                </div>
            </div>

            {/* Weight & Percentage Display */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Weight (%) *
                    </label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Percentage
                    </label>
                    <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-2xl font-bold text-purple-300">
                        {percentage}%
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    {initialData._id ? 'Update Grade' : 'Add Grade'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default GradeForm;
