import React, { useState, useEffect } from 'react';
import coursesService from '../../services/coursesService';
import CourseForm from '../forms/CourseForm';
import Modal from '../shared/Modal';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import { useNotification } from '../../contexts/NotificationContext.jsx';

// ============================================
// CoursesPage Component
// ============================================
const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const { success, error: showError } = useNotification();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await coursesService.getAll();
            setCourses(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCourse(null);
        setShowModal(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowModal(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingCourse) {
                await coursesService.update(editingCourse._id, formData);
                success('Course updated successfully');
            } else {
                await coursesService.create(formData);
                success('Course added successfully');
            }
            setShowModal(false);
            fetchCourses();
        } catch (err) {
            showError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?'))
            return;

        try {
            await coursesService.delete(id);
            success('Course deleted successfully');
            fetchCourses();
        } catch (err) {
            showError(err.message);
        }
    };

    const handleSyncAll = async () => {
        if (!window.confirm('Sync all courses to Google Calendar?')) return;

        try {
            setSyncing(true);
            await coursesService.sync();
            success('All courses synced successfully!');
            fetchCourses();
        } catch (err) {
            showError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    const getDayName = (dayOfWeek) => {
        const days = [
            '',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];
        return days[dayOfWeek];
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen p-6 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            📚 My Courses
                        </h1>
                        <p className="text-white/60">
                            Manage your course schedule for this semester
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSyncAll}
                            disabled={syncing || courses.length === 0}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {syncing ? (
                                <>
                                    <span className="animate-spin">🔄</span>
                                    Syncing...
                                </>
                            ) : (
                                <>🔗 Sync to Calendar</>
                            )}
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            ➕ Add Course
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-7xl mx-auto mb-6">
                    <ErrorMessage message={error} />
                </div>
            )}

            {/* Courses Grid */}
            <div className="max-w-7xl mx-auto">
                {courses.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📖</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            No courses yet
                        </h3>
                        <p className="text-white/60 mb-6">
                            Add your first course to get started
                        </p>
                        <button onClick={handleAdd} className="btn-primary">
                            ➕ Add Your First Course
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <div
                                key={course._id}
                                className="glass-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Course Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                        style={{
                                            backgroundColor:
                                                course.color + '30',
                                        }}
                                    >
                                        📚
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(course._id)
                                            }
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-white/70 hover:text-red-400"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {course.courseName}
                                    </h3>
                                    <p className="text-purple-300 font-medium mb-2">
                                        {course.courseCode}
                                    </p>
                                    {course.instructor && (
                                        <p className="text-white/60 text-sm">
                                            👨‍🏫 {course.instructor}
                                        </p>
                                    )}
                                </div>

                                {/* Schedule */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <span>📅</span>
                                        <span className="font-medium">
                                            {getDayName(course.dayOfWeek)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <span>🕐</span>
                                        <span>
                                            {course.startTime} -{' '}
                                            {course.endTime}
                                        </span>
                                    </div>
                                    {course.location && (
                                        <div className="flex items-center gap-2 text-white/80">
                                            <span>📍</span>
                                            <span>{course.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <span className="text-sm text-white/60">
                                        {course.credits} Credits
                                    </span>
                                    {course.isSynced && (
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                                            ✓ Synced
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingCourse ? 'Edit Course' : 'Add New Course'}
            >
                <CourseForm
                    initialData={editingCourse}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
};

export default CoursesPage;
