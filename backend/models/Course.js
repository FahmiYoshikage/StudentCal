// ============================================
// backend/models/Course.js
// ============================================
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        courseCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        instructor: {
            type: String,
            trim: true,
        },
        credits: {
            type: Number,
            min: 1,
            max: 6,
            default: 3,
        },
        dayOfWeek: {
            type: Number,
            required: true,
            min: 1,
            max: 7,
        },
        startTime: {
            type: String,
            required: true,
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
            type: String,
            required: true,
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        location: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            default: '#8b5cf6',
        },
        semesterStart: {
            type: Date,
            required: true,
        },
        semesterEnd: {
            type: Date,
            required: true,
        },
        googleCalendarEventId: {
            type: String,
            default: null,
        },
        isSynced: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
courseSchema.index({ userId: 1, semesterStart: 1 });
courseSchema.index({ userId: 1, dayOfWeek: 1 });

// Virtual for day name
courseSchema.virtual('dayName').get(function () {
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
    return days[this.dayOfWeek];
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
