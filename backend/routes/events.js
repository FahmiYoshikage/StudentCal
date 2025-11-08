// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const {
    createCustomEvent,
    updateCustomEvent,
    deleteCustomEvent,
} = require('../utils/googleCalendar');

// GET all events for current user
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user._id }).sort({
            startTime: 1,
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new event
router.post('/', async (req, res) => {
    try {
        const { title, description, startTime, endTime } = req.body;

        // Validate required fields
        if (!title || !startTime || !endTime) {
            return res.status(400).json({
                error: 'Title, start time, and end time are required',
            });
        }

        // Create event in MongoDB
        const event = await Event.create({
            userId: req.user._id,
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        });

        // Create event in Google Calendar
        try {
            const eventId = await createCustomEvent(req.user, event);
            event.googleCalendarEventId = eventId;
            await event.save();
        } catch (error) {
            console.error('Failed to create Google Calendar event:', error);
        }

        res.status(201).json({
            message: 'Event created successfully',
            event,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const { title, description, startTime, endTime } = req.body;

        // Update fields
        if (title) event.title = title;
        if (description !== undefined) event.description = description;
        if (startTime) event.startTime = new Date(startTime);
        if (endTime) event.endTime = new Date(endTime);

        await event.save();

        // Update event in Google Calendar
        if (event.googleCalendarEventId) {
            try {
                await updateCustomEvent(req.user, event);
            } catch (error) {
                console.error('Failed to update Google Calendar event:', error);
            }
        }

        res.json({
            message: 'Event updated successfully',
            event,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete from Google Calendar if exists
        if (event.googleCalendarEventId) {
            try {
                await deleteCustomEvent(req.user, event.googleCalendarEventId);
            } catch (error) {
                console.log(
                    'Google Calendar event already deleted or not found'
                );
            }
        }

        await Event.deleteOne({ _id: event._id });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
