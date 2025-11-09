// ============================================
// frontend/src/components/forms/TaskForm.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import coursesService from '../../services/coursesService';

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: initialData.courseId?._id || initialData.courseId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        deadline: initialData.deadline
            ? initialData.deadline.split('T')[0]
            : '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Todo',
        driveLink: initialData.driveLink || '',
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
        onSubmit(formData);
    };

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

            {/* Task Title */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Task Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="e.g., Assignment 1: Binary Trees"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Task details..."
                />
            </div>

            {/* Deadline, Priority, Status */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Deadline *
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Priority *
                    </label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                        <option value="Low" className="bg-gray-900">
                            Low
                        </option>
                        <option value="Medium" className="bg-gray-900">
                            Medium
                        </option>
                        <option value="High" className="bg-gray-900">
                            High
                        </option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Status *
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                        <option value="Todo" className="bg-gray-900">
                            Todo
                        </option>
                        <option value="In Progress" className="bg-gray-900">
                            In Progress
                        </option>
                        <option value="Done" className="bg-gray-900">
                            Done
                        </option>
                    </select>
                </div>
            </div>

            {/* Google Drive Link */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Google Drive Link (optional)
                </label>
                <input
                    type="url"
                    name="driveLink"
                    value={formData.driveLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="https://docs.google.com/..."
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    {initialData._id ? 'Update Task' : 'Add Task'}
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

export default TaskForm;
