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

// models/HabitLog.js
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
    },
    {
        timestamps: true,
    }
);

// Unique index to prevent duplicate logs for same habit on same day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);

// routes/habits.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// GET all habits for current user
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id }).sort({
            createdAt: 1,
        });

        res.json(habits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET today's habits
router.get('/today', async (req, res) => {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday from 0 to 7

        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        // Find habits that should be done today
        const habits = await Habit.find({
            userId: req.user._id,
            goalDays: dayOfWeek,
        });

        // Get today's logs for these habits
        const habitIds = habits.map((h) => h._id);
        const logs = await HabitLog.find({
            habitId: { $in: habitIds },
            date: { $gte: todayStart, $lte: todayEnd },
        });

        // Merge habits with their completion status
        const habitsWithStatus = habits.map((habit) => {
            const log = logs.find(
                (l) => l.habitId.toString() === habit._id.toString()
            );
            return {
                ...habit.toObject(),
                completed: log ? log.completed : false,
                logId: log ? log._id : null,
            };
        });

        res.json(habitsWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET habit statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Get logs for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const logs = await HabitLog.find({
            habitId: habit._id,
            date: { $gte: thirtyDaysAgo },
        }).sort({ date: 1 });

        const completedCount = logs.filter((l) => l.completed).length;
        const totalExpectedDays = calculateExpectedDays(
            habit.goalDays,
            thirtyDaysAgo,
            new Date()
        );
        const completionRate =
            totalExpectedDays > 0
                ? ((completedCount / totalExpectedDays) * 100).toFixed(1)
                : 0;

        // Current streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = logs.length - 1; i >= 0; i--) {
            if (logs[i].completed) {
                currentStreak++;
            } else {
                break;
            }
        }

        res.json({
            habit,
            statistics: {
                completedCount,
                totalExpectedDays,
                completionRate,
                currentStreak,
                last30Days: logs.map((l) => ({
                    date: l.date,
                    completed: l.completed,
                })),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to calculate expected days
function calculateExpectedDays(goalDays, startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
        const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();
        if (goalDays.includes(dayOfWeek)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

// POST create new habit
router.post('/', async (req, res) => {
    try {
        const { habitName, goalDays, color, icon } = req.body;

        // Validate required fields
        if (!habitName || !goalDays || goalDays.length === 0) {
            return res
                .status(400)
                .json({ error: 'Habit name and goal days are required' });
        }

        const habit = await Habit.create({
            userId: req.user._id,
            habitName,
            goalDays,
            color: color || '#3B82F6',
            icon: icon || '✓',
        });

        res.status(201).json({
            message: 'Habit created successfully',
            habit,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update habit
router.put('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const { habitName, goalDays, color, icon } = req.body;

        // Update fields
        if (habitName) habit.habitName = habitName;
        if (goalDays) habit.goalDays = goalDays;
        if (color) habit.color = color;
        if (icon) habit.icon = icon;

        await habit.save();

        res.json({
            message: 'Habit updated successfully',
            habit,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE habit
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Delete all logs for this habit
        await HabitLog.deleteMany({ habitId: habit._id });

        // Delete habit
        await Habit.deleteOne({ _id: habit._id });

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST/PUT toggle habit completion for today
router.post('/:id/toggle', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create log for today
        let log = await HabitLog.findOne({
            habitId: habit._id,
            date: today,
        });

        if (log) {
            // Toggle existing log
            log.completed = !log.completed;
            await log.save();
        } else {
            // Create new log
            log = await HabitLog.create({
                habitId: habit._id,
                date: today,
                completed: true,
            });
        }

        res.json({
            message: 'Habit toggled successfully',
            log,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
