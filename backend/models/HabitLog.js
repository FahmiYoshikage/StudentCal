// ============================================
// backend/models/HabitLog.js
// ============================================
const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema(
    {
        habitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Habit',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate logs for same habit and date
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Helper to get date without time
habitLogSchema.statics.getDateOnly = function (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

module.exports = mongoose.model('HabitLog', habitLogSchema);
