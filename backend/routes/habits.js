// ============================================
// backend/routes/habits.js
// ============================================
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all habits
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const habits = await Habit.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });
        res.json({ success: true, data: habits });
    } catch (error) {
        next(error);
    }
});

// Get today's habits
router.get('/today', ensureAuthenticated, async (req, res, next) => {
    try {
        const today = new Date().getDay() || 7; // Convert 0 (Sunday) to 7
        const habits = await Habit.find({
            userId: req.user._id,
            goalDays: today,
        });

        // Get today's logs
        const dateOnly = HabitLog.getDateOnly(new Date());
        const logs = await HabitLog.find({
            habitId: { $in: habits.map((h) => h._id) },
            date: dateOnly,
        });

        // Combine habits with their logs
        const habitsWithLogs = habits.map((habit) => {
            const log = logs.find(
                (l) => l.habitId.toString() === habit._id.toString()
            );
            return {
                ...habit.toObject(),
                todayCompleted: log ? log.completed : false,
                logId: log ? log._id : null,
            };
        });

        res.json({ success: true, data: habitsWithLogs });
    } catch (error) {
        next(error);
    }
});

// Get habit statistics
router.get('/:id/stats', ensureAuthenticated, async (req, res, next) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res
                .status(404)
                .json({ success: false, message: 'Habit not found' });
        }

        // Get last 30 days of logs
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const logs = await HabitLog.find({
            habitId: habit._id,
            date: { $gte: thirtyDaysAgo },
        }).sort({ date: 1 });

        const completedCount = logs.filter((l) => l.completed).length;
        const totalDays = logs.length;
        const completionRate =
            totalDays > 0 ? ((completedCount / totalDays) * 100).toFixed(1) : 0;

        // Calculate current streak
        let currentStreak = 0;
        const sortedLogs = [...logs].reverse();
        for (const log of sortedLogs) {
            if (log.completed) {
                currentStreak++;
            } else {
                break;
            }
        }

        res.json({
            success: true,
            data: {
                completedCount,
                totalDays,
                completionRate,
                currentStreak,
                logs: logs.map((l) => ({
                    date: l.date,
                    completed: l.completed,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

// Create habit
router.post('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const habit = new Habit({
            ...req.body,
            userId: req.user._id,
        });
        await habit.save();
        res.status(201).json({ success: true, data: habit });
    } catch (error) {
        next(error);
    }
});

// Update habit
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res
                .status(404)
                .json({ success: false, message: 'Habit not found' });
        }

        Object.assign(habit, req.body);
        await habit.save();
        res.json({ success: true, data: habit });
    } catch (error) {
        next(error);
    }
});

// Delete habit
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res
                .status(404)
                .json({ success: false, message: 'Habit not found' });
        }

        // Delete all logs for this habit
        await HabitLog.deleteMany({ habitId: habit._id });
        await habit.deleteOne();

        res.json({ success: true, message: 'Habit deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Toggle habit completion for today
router.post('/:id/toggle', ensureAuthenticated, async (req, res, next) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!habit) {
            return res
                .status(404)
                .json({ success: false, message: 'Habit not found' });
        }

        const dateOnly = HabitLog.getDateOnly(new Date());

        let log = await HabitLog.findOne({
            habitId: habit._id,
            date: dateOnly,
        });

        if (log) {
            log.completed = !log.completed;
            await log.save();
        } else {
            log = await HabitLog.create({
                habitId: habit._id,
                date: dateOnly,
                completed: true,
            });
        }

        res.json({ success: true, data: log });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
