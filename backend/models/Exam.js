// models/Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
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
        examName: {
            type: String,
            required: true,
        },
        examDate: {
            type: Date,
            required: true,
        },
        location: String,
        studyMaterials: [String],
        googleCalendarEventId: String,
    },
    {
        timestamps: true,
    }
);

examSchema.index({ userId: 1, examDate: 1 });

module.exports = mongoose.model('Exam', examSchema);

// routes/exams.js
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Course = require('../models/Course');
const { google } = require('googleapis');

// Helper to decrypt tokens
function decryptToken(encryptedToken) {
    const crypto = require('crypto');
    const decipher = crypto.createDecipher(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY
    );
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Helper to get Google Calendar client
function getGoogleCalendarClient(user) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: decryptToken(user.googleAccessToken),
        refresh_token: decryptToken(user.googleRefreshToken),
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Helper to create exam event in Google Calendar
async function createExamEvent(user, exam, course) {
    const calendar = getGoogleCalendarClient(user);

    const event = {
        summary: `🎯 ${exam.examName}`,
        description: `Mata Kuliah: ${course.courseName}\nLokasi: ${
            exam.location || 'TBA'
        }\n\nMateri Belajar:\n${exam.studyMaterials
            .map((m, i) => `${i + 1}. ${m}`)
            .join('\n')}`,
        location: exam.location || '',
        start: {
            dateTime: exam.examDate.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: new Date(
                exam.examDate.getTime() + 2 * 3600000
            ).toISOString(), // 2 hours duration
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 10080 }, // 1 week before
                { method: 'popup', minutes: 1440 }, // 1 day before
                { method: 'popup', minutes: 60 }, // 1 hour before
            ],
        },
        colorId: '11', // Red color for exams (high priority)
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    return response.data.id;
}

// Helper to update exam event
async function updateExamEvent(user, exam, course) {
    const calendar = getGoogleCalendarClient(user);

    const event = {
        summary: `🎯 ${exam.examName}`,
        description: `Mata Kuliah: ${course.courseName}\nLokasi: ${
            exam.location || 'TBA'
        }\n\nMateri Belajar:\n${exam.studyMaterials
            .map((m, i) => `${i + 1}. ${m}`)
            .join('\n')}`,
        location: exam.location || '',
        start: {
            dateTime: exam.examDate.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: new Date(
                exam.examDate.getTime() + 2 * 3600000
            ).toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
    };

    await calendar.events.update({
        calendarId: 'primary',
        eventId: exam.googleCalendarEventId,
        resource: event,
    });
}

// Helper to delete exam event
async function deleteExamEvent(user, eventId) {
    const calendar = getGoogleCalendarClient(user);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
    });
}

// GET all exams for current user
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find({ userId: req.user._id })
            .populate('courseId', 'courseName courseCode')
            .sort({ examDate: 1 });

        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET upcoming exams
router.get('/upcoming', async (req, res) => {
    try {
        const now = new Date();

        const exams = await Exam.find({
            userId: req.user._id,
            examDate: { $gte: now },
        })
            .populate('courseId', 'courseName courseCode')
            .sort({ examDate: 1 })
            .limit(5);

        // Add countdown days
        const examsWithCountdown = exams.map((exam) => {
            const daysUntil = Math.ceil(
                (new Date(exam.examDate) - now) / (1000 * 60 * 60 * 24)
            );
            return {
                ...exam.toObject(),
                daysUntil,
            };
        });

        res.json(examsWithCountdown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single exam
router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('courseId', 'courseName courseCode');

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new exam
router.post('/', async (req, res) => {
    try {
        const { courseId, examName, examDate, location, studyMaterials } =
            req.body;

        // Validate required fields
        if (!courseId || !examName || !examDate) {
            return res
                .status(400)
                .json({
                    error: 'Course, exam name, and exam date are required',
                });
        }

        // Check if course belongs to user
        const course = await Course.findOne({
            _id: courseId,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Create exam in MongoDB
        const exam = await Exam.create({
            userId: req.user._id,
            courseId,
            examName,
            examDate: new Date(examDate),
            location,
            studyMaterials: studyMaterials || [],
        });

        // Create event in Google Calendar
        try {
            const eventId = await createExamEvent(req.user, exam, course);
            exam.googleCalendarEventId = eventId;
            await exam.save();
        } catch (error) {
            console.error('Failed to create Google Calendar event:', error);
        }

        const populatedExam = await Exam.findById(exam._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.status(201).json({
            message: 'Exam created successfully and synced to Google Calendar',
            exam: populatedExam,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update exam
router.put('/:id', async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        const { examName, examDate, location, studyMaterials } = req.body;

        // Update fields
        if (examName) exam.examName = examName;
        if (examDate) exam.examDate = new Date(examDate);
        if (location !== undefined) exam.location = location;
        if (studyMaterials !== undefined) exam.studyMaterials = studyMaterials;

        await exam.save();

        // Update event in Google Calendar
        if (exam.googleCalendarEventId) {
            try {
                const course = await Course.findById(exam.courseId);
                await updateExamEvent(req.user, exam, course);
            } catch (error) {
                console.error('Failed to update Google Calendar event:', error);
            }
        }

        const populatedExam = await Exam.findById(exam._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.json({
            message: 'Exam updated successfully',
            exam: populatedExam,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE exam
router.delete('/:id', async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Delete from Google Calendar if exists
        if (exam.googleCalendarEventId) {
            try {
                await deleteExamEvent(req.user, exam.googleCalendarEventId);
            } catch (error) {
                console.log(
                    'Google Calendar event already deleted or not found'
                );
            }
        }

        await Exam.deleteOne({ _id: exam._id });

        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
