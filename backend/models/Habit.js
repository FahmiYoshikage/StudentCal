// models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        habitName: {
            type: String,
            required: true,
        },
        goalDays: {
            type: [Number],
            required: true,
            validate: {
                validator: function (days) {
                    return days.every((day) => day >= 1 && day <= 7);
                },
                message: 'Goal days must be between 1 (Monday) and 7 (Sunday)',
            },
        },
        color: {
            type: String,
            default: '#3B82F6',
        },
        icon: {
            type: String,
            default: '✓',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Habit', habitSchema);

