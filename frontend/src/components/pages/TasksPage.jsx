// components/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_COLUMNS = [
    { id: 'Todo', title: '📝 To Do', color: 'bg-gray-50 border-gray-200' },
    {
        id: 'In Progress',
        title: '🔄 In Progress',
        color: 'bg-blue-50 border-blue-200',
    },
    { id: 'Done', title: '✅ Done', color: 'bg-green-50 border-green-200' },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterCourse, setFilterCourse] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        courseId: '',
        status: 'Todo',
        subtasks: [],
        driveLink: '',
    });
    const [newSubtask, setNewSubtask] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [tasksRes, coursesRes] = await Promise.all([
                axios.get(`${API_URL}/api/tasks`, { withCredentials: true }),
                axios.get(`${API_URL}/api/courses`, { withCredentials: true }),
            ]);

            setTasks(tasksRes.data);
            setCourses(coursesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTask) {
                await axios.put(
                    `${API_URL}/api/tasks/${editingTask._id}`,
                    formData,
                    { withCredentials: true }
                );
                alert('✅ Tugas berhasil diupdate!');
            } else {
                await axios.post(`${API_URL}/api/tasks`, formData, {
                    withCredentials: true,
                });
                alert(
                    '✅ Tugas berhasil ditambahkan dan disinkronkan ke Google Calendar!'
                );
            }

            setShowModal(false);
            setEditingTask(null);
            resetForm();
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.response?.data?.error || error.message);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(
                `${API_URL}/api/tasks/${taskId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            fetchData();
        } catch (error) {
            alert('❌ Error updating status: ' + error.message);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            deadline: new Date(task.deadline).toISOString().slice(0, 16),
            courseId: task.courseId?._id || '',
            status: task.status,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Hapus tugas ini? Event di Google Calendar juga akan dihapus.'
            )
        ) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`, {
                withCredentials: true,
            });
            alert('✅ Tugas berhasil dihapus!');
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            deadline: '',
            courseId: '',
            status: 'Todo',
        });
    };

    const getFilteredTasks = () => {
        if (filterCourse === 'all') return tasks;
        return tasks.filter((task) => task.courseId?._id === filterCourse);
    };

    const getTasksByStatus = (status) => {
        return getFilteredTasks().filter((task) => task.status === status);
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const formattedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });

        if (diffDays < 0) return `${formattedDate} (Terlambat!)`;
        if (diffDays === 0) return `${formattedDate} (Hari ini!)`;
        if (diffDays === 1) return `${formattedDate} (Besok)`;
        if (diffDays <= 7) return `${formattedDate} (${diffDays} hari lagi)`;
        return formattedDate;
    };

    const getDeadlineColor = (deadline, status) => {
        if (status === 'Done') return 'text-green-600';

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
                    <p className="mt-4 text-gray-600">Loading tasks...</p>
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
                        📝 Tugas Kuliah
                    </h1>
                    <p className="text-gray-600">
                        Kelola semua tugas kuliah dengan Kanban Board
                    </p>
                </div>

                {/* Actions & Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        ➕ Tambah Tugas
                    </button>

                    <select
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Semua Mata Kuliah</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STATUS_COLUMNS.map((column) => {
                        const columnTasks = getTasksByStatus(column.id);

                        return (
                            <div key={column.id} className="flex flex-col">
                                <div
                                    className={`rounded-t-lg p-4 ${column.color} border-t-4`}
                                >
                                    <h2 className="font-semibold text-gray-900">
                                        {column.title}
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({columnTasks.length})
                                        </span>
                                    </h2>
                                </div>

                                <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-4 space-y-3 min-h-[500px]">
                                    {columnTasks.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <p className="text-2xl mb-2">📭</p>
                                            <p className="text-sm">
                                                Tidak ada tugas
                                            </p>
                                        </div>
                                    ) : (
                                        columnTasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-move"
                                            >
                                                <h3 className="font-medium text-gray-900 mb-2">
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {task.courseId && (
                                                    <div className="mb-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                            {
                                                                task.courseId
                                                                    .courseName
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="text-xs mb-3">
                                                    <span
                                                        className={getDeadlineColor(
                                                            task.deadline,
                                                            task.status
                                                        )}
                                                    >
                                                        ⏰{' '}
                                                        {formatDeadline(
                                                            task.deadline
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Status Change Buttons */}
                                                <div className="flex gap-2 mb-2">
                                                    {column.id !== 'Todo' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    task._id,
                                                                    column.id ===
                                                                        'Done'
                                                                        ? 'In Progress'
                                                                        : 'Todo'
                                                                )
                                                            }
                                                            className="flex-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                        >
                                                            ←{' '}
                                                            {column.id ===
                                                            'Done'
                                                                ? 'Progress'
                                                                : 'Todo'}
                                                        </button>
                                                    )}
                                                    {column.id !== 'Done' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    task._id,
                                                                    column.id ===
                                                                        'Todo'
                                                                        ? 'In Progress'
                                                                        : 'Done'
                                                                )
                                                            }
                                                            className="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                                        >
                                                            {column.id ===
                                                            'Todo'
                                                                ? 'Progress'
                                                                : 'Done'}{' '}
                                                            →
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-2 border-t">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(task)
                                                        }
                                                        className="flex-1 text-xs px-2 py-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                task._id
                                                            )
                                                        }
                                                        className="flex-1 text-xs px-2 py-1 text-red-600 hover:text-red-800"
                                                    >
                                                        🗑️ Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingTask ? 'Edit Tugas' : 'Tambah Tugas'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul Tugas *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Esai Sejarah Indonesia"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tulis minimal 1000 kata tentang..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Deadline *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={formData.deadline}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    deadline: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mata Kuliah
                                        </label>
                                        <select
                                            value={formData.courseId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    courseId: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                Tidak terkait matkul
                                            </option>
                                            {courses.map((course) => (
                                                <option
                                                    key={course._id}
                                                    value={course._id}
                                                >
                                                    {course.courseName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {editingTask && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Todo">Todo</option>
                                            <option value="In Progress">
                                                In Progress
                                            </option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        {editingTask ? 'Update' : 'Simpan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingTask(null);
                                            resetForm();
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                    >
                                        Batal
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
