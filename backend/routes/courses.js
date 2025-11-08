// routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const {
    createRecurringCourseEvent,
    deleteCourseEvent,
} = require('../utils/googleCalendar');

// GET all courses for current user
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ userId: req.user._id }).sort({
            dayOfWeek: 1,
            startTime: 1,
        });

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new course
router.post('/', async (req, res) => {
    try {
        const {
            courseName,
            courseCode,
            lecturerName,
            dayOfWeek,
            startTime,
            endTime,
            location,
            semesterStartDate,
            semesterEndDate,
        } = req.body;

        // Validate required fields
        if (
            !courseName ||
            !lecturerName ||
            !dayOfWeek ||
            !startTime ||
            !endTime ||
            !semesterStartDate ||
            !semesterEndDate
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create course in MongoDB
        const course = await Course.create({
            userId: req.user._id,
            courseName,
            courseCode,
            lecturerName,
            dayOfWeek,
            startTime,
            endTime,
            location,
            semesterStartDate: new Date(semesterStartDate),
            semesterEndDate: new Date(semesterEndDate),
        });

        res.status(201).json({
            message:
                'Course created successfully. Use sync button to add to Google Calendar.',
            course,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update course
router.put('/:id', async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const {
            courseName,
            courseCode,
            lecturerName,
            dayOfWeek,
            startTime,
            endTime,
            location,
            semesterStartDate,
            semesterEndDate,
        } = req.body;

        // Update fields
        if (courseName) course.courseName = courseName;
        if (courseCode !== undefined) course.courseCode = courseCode;
        if (lecturerName) course.lecturerName = lecturerName;
        if (dayOfWeek) course.dayOfWeek = dayOfWeek;
        if (startTime) course.startTime = startTime;
        if (endTime) course.endTime = endTime;
        if (location !== undefined) course.location = location;
        if (semesterStartDate)
            course.semesterStartDate = new Date(semesterStartDate);
        if (semesterEndDate) course.semesterEndDate = new Date(semesterEndDate);

        await course.save();

        res.json({
            message:
                'Course updated successfully. Re-sync to update Google Calendar.',
            course,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE course
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Delete from Google Calendar if exists
        if (course.googleCalendarEventSeriesId) {
            try {
                await deleteCourseEvent(
                    req.user,
                    course.googleCalendarEventSeriesId
                );
            } catch (error) {
                console.log(
                    'Google Calendar event already deleted or not found'
                );
            }
        }

        await Course.deleteOne({ _id: course._id });

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST sync all courses to Google Calendar (MOST IMPORTANT FEATURE!)
router.post('/sync', async (req, res) => {
    try {
        const courses = await Course.find({ userId: req.user._id });

        if (courses.length === 0) {
            return res.json({
                message: 'No courses to sync',
                results: [],
            });
        }

        const results = [];

        for (const course of courses) {
            try {
                // Delete old event if exists
                if (course.googleCalendarEventSeriesId) {
                    try {
                        await deleteCourseEvent(
                            req.user,
                            course.googleCalendarEventSeriesId
                        );
                    } catch (err) {
                        console.log('Old event not found, continuing...');
                    }
                }

                // Create new recurring event
                const eventId = await createRecurringCourseEvent(
                    req.user,
                    course
                );

                // Update course with new event ID
                course.googleCalendarEventSeriesId = eventId;
                await course.save();

                results.push({
                    courseName: course.courseName,
                    status: 'success',
                    eventId: eventId,
                });
            } catch (error) {
                results.push({
                    courseName: course.courseName,
                    status: 'error',
                    error: error.message,
                });
            }
        }

        const successCount = results.filter(
            (r) => r.status === 'success'
        ).length;
        const errorCount = results.filter((r) => r.status === 'error').length;

        res.json({
            message: `Sync completed: ${successCount} success, ${errorCount} errors`,
            results,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
