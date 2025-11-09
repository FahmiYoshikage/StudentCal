// ============================================
// backend/routes/exams.js
// ============================================
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Course = require('../models/Course');
const { ensureAuthenticated, ensureGoogleAuth } = require('../middleware/auth');
const {
    createExamEvent,
    updateExamEvent,
    deleteExamEvent,
} = require('../utils/googleCalendar');

// Get all exams
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const exams = await Exam.find({ userId: req.user._id })
            .populate('courseId', 'courseName courseCode')
            .sort({ examDate: 1 });
        res.json({ success: true, data: exams });
    } catch (error) {
        next(error);
    }
});

// Get upcoming exams
router.get('/upcoming', ensureAuthenticated, async (req, res, next) => {
    try {
        const now = new Date();
        const exams = await Exam.find({
            userId: req.user._id,
            examDate: { $gte: now },
        })
            .populate('courseId', 'courseName courseCode color')
            .sort({ examDate: 1 })
            .limit(5);
        res.json({ success: true, data: exams });
    } catch (error) {
        next(error);
    }
});

// Get single exam
router.get('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('courseId');

        if (!exam) {
            return res
                .status(404)
                .json({ success: false, message: 'Exam not found' });
        }
        res.json({ success: true, data: exam });
    } catch (error) {
        next(error);
    }
});

// Create exam with Google Calendar sync
router.post('/', ensureGoogleAuth, async (req, res, next) => {
    try {
        const examData = {
            ...req.body,
            userId: req.user._id,
        };

        const exam = new Exam(examData);
        await exam.save();

        // Create Google Calendar event
        try {
            const eventId = await createExamEvent(req.user, exam);
            exam.googleCalendarEventId = eventId;
            await exam.save();
        } catch (gcalError) {
            console.error('Google Calendar sync failed:', gcalError);
        }

        await exam.populate('courseId', 'courseName courseCode');
        res.status(201).json({ success: true, data: exam });
    } catch (error) {
        next(error);
    }
});

// Update exam
router.put('/:id', ensureGoogleAuth, async (req, res, next) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!exam) {
            return res
                .status(404)
                .json({ success: false, message: 'Exam not found' });
        }

        Object.assign(exam, req.body);
        await exam.save();

        // Update Google Calendar event
        if (exam.googleCalendarEventId) {
            try {
                await updateExamEvent(req.user, exam);
            } catch (gcalError) {
                console.error('Google Calendar update failed:', gcalError);
            }
        }

        await exam.populate('courseId');
        res.json({ success: true, data: exam });
    } catch (error) {
        next(error);
    }
});

// Delete exam
router.delete('/:id', ensureGoogleAuth, async (req, res, next) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!exam) {
            return res
                .status(404)
                .json({ success: false, message: 'Exam not found' });
        }

        // Delete from Google Calendar
        if (exam.googleCalendarEventId) {
            try {
                await deleteExamEvent(req.user, exam.googleCalendarEventId);
            } catch (gcalError) {
                console.error('Google Calendar delete failed:', gcalError);
            }
        }

        await exam.deleteOne();
        res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
