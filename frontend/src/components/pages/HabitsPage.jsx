// components/HabitsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DAYS = [
    { value: 1, label: 'Sen', fullLabel: 'Senin' },
    { value: 2, label: 'Sel', fullLabel: 'Selasa' },
    { value: 3, label: 'Rab', fullLabel: 'Rabu' },
    { value: 4, label: 'Kam', fullLabel: 'Kamis' },
    { value: 5, label: 'Jum', fullLabel: 'Jumat' },
    { value: 6, label: 'Sab', fullLabel: 'Sabtu' },
    { value: 7, label: 'Min', fullLabel: 'Minggu' },
];

const HABIT_ICONS = ['✓', '📚', '💪', '🏃', '🧘', '💻', '🎯', '⭐', '🔥', '💡'];
const HABIT_COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
];

export default function HabitsPage() {
    const [todaysHabits, setTodaysHabits] = useState([]);
    const [allHabits, setAllHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [formData, setFormData] = useState({
        habitName: '',
        goalDays: [],
        color: '#3B82F6',
        icon: '✓',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [todayRes, allRes] = await Promise.all([
                axios.get(`${API_URL}/api/habits/today`, {
                    withCredentials: true,
                }),
                axios.get(`${API_URL}/api/habits`, { withCredentials: true }),
            ]);

            setTodaysHabits(todayRes.data);
            setAllHabits(allRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching habits:', error);
            setLoading(false);
        }
    };

    const handleToggle = async (habitId) => {
        try {
            await axios.post(
                `${API_URL}/api/habits/${habitId}/toggle`,
                {},
                { withCredentials: true }
            );
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.goalDays.length === 0) {
            alert('Please select at least one day');
            return;
        }

        try {
            if (editingHabit) {
                await axios.put(
                    `${API_URL}/api/habits/${editingHabit._id}`,
                    formData,
                    { withCredentials: true }
                );
                alert('✅ Habit updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/habits`, formData, {
                    withCredentials: true,
                });
                alert('✅ Habit created successfully!');
            }

            setShowModal(false);
            setEditingHabit(null);
            resetForm();
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.response?.data?.error || error.message);
        }
    };

    const handleEdit = (habit) => {
        setEditingHabit(habit);
        setFormData({
            habitName: habit.habitName,
            goalDays: habit.goalDays,
            color: habit.color,
            icon: habit.icon,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Delete this habit? All tracking history will be lost.'
            )
        ) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/habits/${id}`, {
                withCredentials: true,
            });
            alert('✅ Habit deleted successfully!');
            fetchData();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            habitName: '',
            goalDays: [],
            color: '#3B82F6',
            icon: '✓',
        });
    };

    const toggleDay = (day) => {
        if (formData.goalDays.includes(day)) {
            setFormData({
                ...formData,
                goalDays: formData.goalDays.filter((d) => d !== day),
            });
        } else {
            setFormData({
                ...formData,
                goalDays: [...formData.goalDays, day].sort(),
            });
        }
    };

    const getDayLabels = (goalDays) => {
        if (goalDays.length === 7) return 'Setiap Hari';
        if (
            goalDays.length === 5 &&
            !goalDays.includes(6) &&
            !goalDays.includes(7)
        ) {
            return 'Weekdays';
        }
        return goalDays
            .map((d) => DAYS.find((day) => day.value === d)?.label)
            .join(', ');
    };

    const getTodayName = () => {
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        return DAYS.find((d) => d.value === dayOfWeek)?.fullLabel || '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading habits...</p>
                </div>
            </div>
        );
    }

    const completedToday = todaysHabits.filter((h) => h.completed).length;
    const totalToday = todaysHabits.length;
    const completionPercentage =
        totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎯 Pelacak Kebiasaan
                    </h1>
                    <p className="text-gray-600">
                        Build better habits, one day at a time
                    </p>
                </div>

                {/* Today's Progress */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-8 text-white">
                    <h2 className="text-xl font-semibold mb-4">
                        📅 {getTodayName()},{' '}
                        {new Date().toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm opacity-90">
                            Progress Hari Ini
                        </span>
                        <span className="text-2xl font-bold">
                            {completedToday} / {totalToday}
                        </span>
                    </div>

                    <div className="bg-white bg-opacity-30 rounded-full h-4 mb-2">
                        <div
                            className="bg-white h-4 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    <p className="text-sm opacity-90">
                        {completionPercentage === 100
                            ? '🎉 Perfect day! All habits completed!'
                            : `Keep going! ${
                                  totalToday - completedToday
                              } habits left.`}
                    </p>
                </div>

                {/* Today's Habits */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            ✅ Kebiasaan Hari Ini
                        </h2>
                        <button
                            onClick={() => {
                                setEditingHabit(null);
                                resetForm();
                                setShowModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            ➕ Tambah Kebiasaan
                        </button>
                    </div>

                    {todaysHabits.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <span className="text-6xl mb-4 block">🌟</span>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Habits for Today
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Create your first habit to get started!
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                ➕ Create Habit
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todaysHabits.map((habit) => (
                                <div
                                    key={habit._id}
                                    className={`relative bg-white rounded-lg shadow p-6 transition cursor-pointer ${
                                        habit.completed
                                            ? 'ring-2 ring-green-500 bg-green-50'
                                            : 'hover:shadow-lg'
                                    }`}
                                    onClick={() => handleToggle(habit._id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center flex-1">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 ${
                                                    habit.completed
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-200'
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        habit.completed
                                                            ? '#10B981'
                                                            : habit.color +
                                                              '20',
                                                    color: habit.completed
                                                        ? 'white'
                                                        : habit.color,
                                                }}
                                            >
                                                {habit.completed
                                                    ? '✓'
                                                    : habit.icon}
                                            </div>

                                            <div className="flex-1">
                                                <h3
                                                    className={`font-semibold text-gray-900 ${
                                                        habit.completed
                                                            ? 'line-through text-gray-500'
                                                            : ''
                                                    }`}
                                                >
                                                    {habit.habitName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {getDayLabels(
                                                        habit.goalDays
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(habit);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 ml-2"
                                        >
                                            ⚙️
                                        </button>
                                    </div>

                                    {habit.completed && (
                                        <div className="mt-3 text-sm text-green-600 font-medium">
                                            ✓ Completed!
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Habits List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        📋 Semua Kebiasaan
                    </h2>

                    {allHabits.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-600">
                                No habits created yet
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kebiasaan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Hari Target
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {allHabits.map((habit) => (
                                        <tr
                                            key={habit._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                                                        style={{
                                                            backgroundColor:
                                                                habit.color +
                                                                '20',
                                                            color: habit.color,
                                                        }}
                                                    >
                                                        {habit.icon}
                                                    </div>
                                                    <span className="font-medium text-gray-900">
                                                        {habit.habitName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {getDayLabels(
                                                        habit.goalDays
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(habit)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(habit._id)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingHabit
                                    ? 'Edit Kebiasaan'
                                    : 'Tambah Kebiasaan'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Kebiasaan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.habitName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                habitName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Baca Buku 30 Menit, Olahraga"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hari Target *
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() =>
                                                    toggleDay(day.value)
                                                }
                                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                                    formData.goalDays.includes(
                                                        day.value
                                                    )
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {HABIT_ICONS.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        icon,
                                                    })
                                                }
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition ${
                                                    formData.icon === icon
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color
                                    </label>
                                    <div className="flex gap-2">
                                        {HABIT_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        color,
                                                    })
                                                }
                                                className={`w-10 h-10 rounded-lg transition ${
                                                    formData.color === color
                                                        ? 'ring-2 ring-offset-2 ring-gray-400'
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        {editingHabit ? 'Update' : 'Simpan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingHabit(null);
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
