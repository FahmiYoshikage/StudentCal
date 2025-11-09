// ============================================
// backend/models/Task.js
// ============================================
const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { _id: true }
);

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
            required: true,
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
        deadline: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Done'],
            default: 'Todo',
        },
        subtasks: [subtaskSchema],
        driveLink: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return /^https:\/\/(docs|drive)\.google\.com/.test(v);
                },
                message: 'Must be a valid Google Drive/Docs link',
            },
        },
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
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ courseId: 1 });

// Virtual for subtask progress
taskSchema.virtual('subtaskProgress').get(function () {
    if (!this.subtasks || this.subtasks.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
    }
    const completed = this.subtasks.filter((st) => st.completed).length;
    const total = this.subtasks.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
