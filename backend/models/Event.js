// ============================================
// backend/models/Event.js
// ============================================
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            default: '#ec4899',
        },
        isAllDay: {
            type: Boolean,
            default: false,
        },
        reminders: [
            {
                method: {
                    type: String,
                    enum: ['popup', 'email'],
                    default: 'popup',
                },
                minutes: {
                    type: Number,
                    default: 30,
                },
            },
        ],
        googleCalendarEventId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
eventSchema.index({ userId: 1, startDateTime: 1 });
eventSchema.index({ userId: 1, endDateTime: 1 });

module.exports = mongoose.model('Event', eventSchema);
