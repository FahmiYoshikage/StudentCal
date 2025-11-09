// ============================================
// frontend/src/components/forms/HabitForm.jsx
// ============================================
import React, { useState } from 'react';

const HabitForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        habitName: initialData.habitName || '',
        goalDays: initialData.goalDays || [],
        icon: initialData.icon || '⭐',
        color: initialData.color || '#8b5cf6',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleDay = (day) => {
        setFormData((prev) => ({
            ...prev,
            goalDays: prev.goalDays.includes(day)
                ? prev.goalDays.filter((d) => d !== day)
                : [...prev.goalDays, day].sort((a, b) => a - b),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.goalDays.length === 0) {
            alert('Please select at least one day');
            return;
        }

        onSubmit(formData);
    };

    const days = [
        { value: 1, label: 'Mon', full: 'Monday' },
        { value: 2, label: 'Tue', full: 'Tuesday' },
        { value: 3, label: 'Wed', full: 'Wednesday' },
        { value: 4, label: 'Thu', full: 'Thursday' },
        { value: 5, label: 'Fri', full: 'Friday' },
        { value: 6, label: 'Sat', full: 'Saturday' },
        { value: 7, label: 'Sun', full: 'Sunday' },
    ];

    const icons = [
        '⭐',
        '📚',
        '💪',
        '🏃',
        '🧘',
        '🎯',
        '✍️',
        '🎨',
        '🎵',
        '🌟',
        '🔥',
        '💡',
        '🚀',
        '🎓',
        '📖',
        '⚡',
        '🌈',
        '🌙',
        '☀️',
        '🌱',
    ];

    const colors = [
        '#8b5cf6',
        '#ec4899',
        '#06b6d4',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#6366f1',
        '#84cc16',
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Habit Name *
                </label>
                <input
                    type="text"
                    name="habitName"
                    value={formData.habitName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="e.g., Morning Study, Exercise, Read Articles"
                />
            </div>

            {/* Goal Days */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">
                    Goal Days *{' '}
                    <span className="text-white/50 text-xs">
                        (Select at least one)
                    </span>
                </label>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(day.value)}
                            className={`py-3 rounded-lg font-medium text-sm transition-all ${
                                formData.goalDays.includes(day.value)
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                            }`}
                            title={day.full}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Icon Picker */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">
                    Habit Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                    {icons.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({ ...prev, icon }))
                            }
                            className={`h-12 text-2xl rounded-lg transition-all ${
                                formData.icon === icon
                                    ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-110'
                                    : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                            }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Picker */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">
                    Habit Color
                </label>
                <div className="flex gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({ ...prev, color }))
                            }
                            className={`w-12 h-12 rounded-lg transition-all ${
                                formData.color === color
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110'
                                    : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-white/5 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-300 mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: formData.color + '30' }}
                    >
                        {formData.icon}
                    </div>
                    <div>
                        <p className="font-medium text-white">
                            {formData.habitName || 'Habit Name'}
                        </p>
                        <p className="text-sm text-white/60">
                            {formData.goalDays.length > 0
                                ? `${formData.goalDays.length} day${
                                      formData.goalDays.length > 1 ? 's' : ''
                                  } per week`
                                : 'No days selected'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    {initialData._id ? 'Update Habit' : 'Add Habit'}
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

export default HabitForm;
