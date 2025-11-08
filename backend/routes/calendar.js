// routes/calendar.js
const express = require('express');
const router = express.Router();
const { getCalendarEvents } = require('../utils/googleCalendar');

// GET all Google Calendar events for a period
router.get('/events', async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res
                .status(400)
                .json({ error: 'Start and end dates are required' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        const events = await getCalendarEvents(req.user, startDate, endDate);

        // Transform events to FullCalendar format
        const formattedEvents = events.map((event) => ({
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            description: event.description,
            location: event.location,
            color: getEventColor(event.summary),
        }));

        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to determine event color based on emoji
function getEventColor(summary) {
    if (summary.includes('🎓')) return '#10B981'; // Green for courses
    if (summary.includes('📝')) return '#3B82F6'; // Blue for tasks
    if (summary.includes('✅')) return '#6B7280'; // Gray for completed tasks
    if (summary.includes('📅')) return '#EF4444'; // Red for custom events
    return '#8B5CF6'; // Purple for other events
}

module.exports = router;
