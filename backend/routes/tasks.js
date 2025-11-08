// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const {
    createTaskEvent,
    updateTaskEvent,
    deleteTaskEvent,
} = require('../utils/googleCalendar');

// GET all tasks for current user
router.get('/', async (req, res) => {
    try {
        const { status, courseId } = req.query;

        const query = { userId: req.user._id };

        if (status) {
            query.status = status;
        }

        if (courseId) {
            query.courseId = courseId;
        }

        const tasks = await Task.find(query)
            .populate('courseId', 'courseName courseCode')
            .sort({ deadline: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET upcoming tasks (not done, deadline within 30 days)
router.get('/upcoming', async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        const tasks = await Task.find({
            userId: req.user._id,
            status: { $ne: 'Done' },
            deadline: {
                $gte: today,
                $lte: thirtyDaysLater,
            },
        })
            .populate('courseId', 'courseName courseCode')
            .sort({ deadline: 1 })
            .limit(10);

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('courseId', 'courseName courseCode');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, deadline, courseId, status } = req.body;

        // Validate required fields
        if (!title || !deadline) {
            return res
                .status(400)
                .json({ error: 'Title and deadline are required' });
        }

        // Create task in MongoDB
        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            deadline: new Date(deadline),
            courseId: courseId || null,
            status: status || 'Todo',
        });

        // Create event in Google Calendar
        try {
            const eventId = await createTaskEvent(req.user, task);
            task.googleCalendarEventId = eventId;
            await task.save();
        } catch (error) {
            console.error('Failed to create Google Calendar event:', error);
            // Task still created in MongoDB even if GCal fails
        }

        const populatedTask = await Task.findById(task._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.status(201).json({
            message: 'Task created successfully',
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const { title, description, deadline, courseId, status } = req.body;

        // Update fields
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (deadline) task.deadline = new Date(deadline);
        if (courseId !== undefined) task.courseId = courseId;
        if (status) task.status = status;

        await task.save();

        // Update event in Google Calendar
        if (task.googleCalendarEventId) {
            try {
                await updateTaskEvent(req.user, task);
            } catch (error) {
                console.error('Failed to update Google Calendar event:', error);
            }
        }

        const populatedTask = await Task.findById(task._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.json({
            message: 'Task updated successfully',
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH update task status only
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Todo', 'In Progress', 'Done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = status;
        await task.save();

        // Update event in Google Calendar
        if (task.googleCalendarEventId) {
            try {
                await updateTaskEvent(req.user, task);
            } catch (error) {
                console.error('Failed to update Google Calendar event:', error);
            }
        }

        const populatedTask = await Task.findById(task._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.json({
            message: 'Task status updated successfully',
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Delete from Google Calendar if exists
        if (task.googleCalendarEventId) {
            try {
                await deleteTaskEvent(req.user, task.googleCalendarEventId);
            } catch (error) {
                console.log(
                    'Google Calendar event already deleted or not found'
                );
            }
        }

        await Task.deleteOne({ _id: task._id });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
