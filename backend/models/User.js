// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        avatarUrl: String,
        googleAccessToken: {
            type: String,
            required: true,
        },
        googleRefreshToken: {
            type: String,
            required: true,
        },
        settings: {
            defaultReminderTime: {
                type: Number,
                default: 60,
            },
            timezone: {
                type: String,
                default: 'Asia/Jakarta',
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);

// models/Course.js
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
        },
        courseCode: String,
        lecturerName: {
            type: String,
            required: true,
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
        },
        endTime: {
            type: String,
            required: true,
        },
        location: String,
        semesterStartDate: {
            type: Date,
            required: true,
        },
        semesterEndDate: {
            type: Date,
            required: true,
        },
        googleCalendarEventSeriesId: String,
    },
    {
        timestamps: true,
    }
);

courseSchema.index({ userId: 1, semesterEndDate: -1 });

module.exports = mongoose.model('Course', courseSchema);

// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Done'],
            default: 'Todo',
            index: true,
        },
        googleCalendarEventId: String,
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);

// models/Event.js
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
        },
        description: String,
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        googleCalendarEventId: String,
    },
    {
        timestamps: true,
    }
);

eventSchema.index({ userId: 1, startTime: 1 });

module.exports = mongoose.model('Event', eventSchema);
