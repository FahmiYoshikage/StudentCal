// ============================================
// frontend/src/components/forms/ExamForm.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import coursesService from '../../services/coursesService';

const ExamForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: initialData.courseId?._id || initialData.courseId || '',
        examName: initialData.examName || '',
        examDate: initialData.examDate
            ? initialData.examDate.split('T')[0]
            : '',
        examTime: initialData.examDate
            ? new Date(initialData.examDate).toTimeString().slice(0, 5)
            : '09:00',
        location: initialData.location || '',
        studyMaterials: initialData.studyMaterials?.join('\n') || '',
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

        // Combine date and time
        const examDateTime = new Date(
            `${formData.examDate}T${formData.examTime}`
        );

        // Split study materials by newline
        const studyMaterials = formData.studyMaterials
            .split('\n')
            .filter((item) => item.trim())
            .map((item) => item.trim());

        onSubmit({
            courseId: formData.courseId,
            examName: formData.examName,
            examDate: examDateTime,
            location: formData.location,
            studyMaterials,
        });
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

            {/* Exam Name */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Exam Name *
                </label>
                <input
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="e.g., Midterm Exam, Final Exam"
                />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Exam Date *
                    </label>
                    <input
                        type="date"
                        name="examDate"
                        value={formData.examDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                        Exam Time *
                    </label>
                    <input
                        type="time"
                        name="examTime"
                        value={formData.examTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Location *
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="e.g., Main Hall, Room B201"
                />
            </div>

            {/* Study Materials */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Study Materials (one per line)
                </label>
                <textarea
                    name="studyMaterials"
                    value={formData.studyMaterials}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                    placeholder="Chapter 1-5&#10;All lecture slides&#10;Practice problems&#10;Previous exams"
                />
                <p className="text-xs text-white/50 mt-2">
                    💡 Press Enter for new line
                </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    {initialData._id ? 'Update Exam' : 'Add Exam'}
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

export default ExamForm;
