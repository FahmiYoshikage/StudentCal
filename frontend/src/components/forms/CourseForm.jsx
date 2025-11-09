// ============================================
// frontend/src/components/forms/CourseForm.jsx
// ============================================
import React, { useState } from 'react';

const CourseForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    courseName: initialData.courseName || '',
    courseCode: initialData.courseCode || '',
    instructor: initialData.instructor || '',
    credits: initialData.credits || 3,
    dayOfWeek: initialData.dayOfWeek || 1,
    startTime: initialData.startTime || '08:00',
    endTime: initialData.endTime || '10:00',
    location: initialData.location || '',
    color: initialData.color || '#8b5cf6',
    semesterStart: initialData.semesterStart ? initialData.semesterStart.split('T')[0] : '',
    semesterEnd: initialData.semesterEnd ? initialData.semesterEnd.split('T')[0] : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const days = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
  ];

  const colors = [
    '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', 
    '#f59e0b', '#ef4444', '#6366f1', '#84cc16'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Name & Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Course Name *
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder="e.g., Data Structures"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Course Code *
          </label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all uppercase"
            placeholder="e.g., CS201"
          />
        </div>
      </div>

      {/* Instructor & Credits */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Instructor
          </label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder="e.g., Dr. Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Credits *
          </label>
          <select
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n} className="bg-gray-900">{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Day & Time */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Day *
          </label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            {days.map(day => (
              <option key={day.value} value={day.value} className="bg-gray-900">
                {day.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            End Time *
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          placeholder="e.g., Room A301"
        />
      </div>

      {/* Semester Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Semester Start *
          </label>
          <input
            type="date"
            name="semesterStart"
            value={formData.semesterStart}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Semester End *
          </label>
          <input
            type="date"
            name="semesterEnd"
            value={formData.semesterEnd}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Course Color
        </label>
        <div className="flex gap-3">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-10 h-10 rounded-lg transition-all ${
                formData.color === color 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' 
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
        >
          {initialData._id ? 'Update Course' : 'Add Course'}
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

export default CourseForm;
