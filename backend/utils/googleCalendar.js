// utils/googleCalendar.js
const { google } = require('googleapis');
const crypto = require('crypto');

function decryptToken(encryptedToken) {
    const decipher = crypto.createDecipher(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY
    );
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

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

// Create single task event in Google Calendar
async function createTaskEvent(user, task) {
    const calendar = getGoogleCalendarClient(user);

    const event = {
        summary: `📝 ${task.title}`,
        description: task.description || '',
        start: {
            dateTime: task.deadline.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: new Date(task.deadline.getTime() + 3600000).toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 1440 }, // 1 day before
                { method: 'popup', minutes: 60 }, // 1 hour before
            ],
        },
        colorId: '1', // Default blue color
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    return response.data.id;
}

// Update task event in Google Calendar
async function updateTaskEvent(user, task) {
    const calendar = getGoogleCalendarClient(user);

    // Get existing event
    const existingEvent = await calendar.events.get({
        calendarId: 'primary',
        eventId: task.googleCalendarEventId,
    });

    const event = {
        summary:
            task.status === 'Done'
                ? `✅ [SELESAI] ${task.title}`
                : `📝 ${task.title}`,
        description: task.description || '',
        start: {
            dateTime: task.deadline.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: new Date(task.deadline.getTime() + 3600000).toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        colorId: task.status === 'Done' ? '8' : '1', // Gray if done, blue otherwise
    };

    await calendar.events.update({
        calendarId: 'primary',
        eventId: task.googleCalendarEventId,
        resource: event,
    });
}

// Delete task event from Google Calendar
async function deleteTaskEvent(user, eventId) {
    const calendar = getGoogleCalendarClient(user);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
    });
}

// Create recurring course event
async function createRecurringCourseEvent(user, course) {
    const calendar = getGoogleCalendarClient(user);

    // Convert dayOfWeek to RRULE format
    const daysMap = ['', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    const dayCode = daysMap[course.dayOfWeek];

    // Find first occurrence date
    const firstDate = new Date(course.semesterStartDate);
    const targetDay = course.dayOfWeek === 7 ? 0 : course.dayOfWeek;

    while (firstDate.getDay() !== targetDay) {
        firstDate.setDate(firstDate.getDate() + 1);
    }

    // Parse start and end times
    const [startHour, startMinute] = course.startTime.split(':');
    const [endHour, endMinute] = course.endTime.split(':');

    const startDateTime = new Date(firstDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

    const endDateTime = new Date(firstDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

    // Format UNTIL date for RRULE
    const untilDate = course.semesterEndDate
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '');

    const event = {
        summary: `🎓 ${course.courseName}`,
        description: `Dosen: ${course.lecturerName}\nKode: ${
            course.courseCode || '-'
        }`,
        location: course.location || '',
        start: {
            dateTime: startDateTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: endDateTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${dayCode};UNTIL=${untilDate}`],
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
        },
        colorId: '10', // Green color for courses
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    return response.data.id;
}

// Delete course recurring event
async function deleteCourseEvent(user, eventSeriesId) {
    const calendar = getGoogleCalendarClient(user);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventSeriesId,
    });
}

// Create custom event
async function createCustomEvent(user, event) {
    const calendar = getGoogleCalendarClient(user);

    const gcalEvent = {
        summary: `📅 ${event.title}`,
        description: event.description || '',
        start: {
            dateTime: event.startTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: event.endTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
        },
        colorId: '11', // Red color for custom events
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: gcalEvent,
    });

    return response.data.id;
}

// Update custom event
async function updateCustomEvent(user, event) {
    const calendar = getGoogleCalendarClient(user);

    const gcalEvent = {
        summary: `📅 ${event.title}`,
        description: event.description || '',
        start: {
            dateTime: event.startTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
        end: {
            dateTime: event.endTime.toISOString(),
            timeZone: user.settings.timezone || 'Asia/Jakarta',
        },
    };

    await calendar.events.update({
        calendarId: 'primary',
        eventId: event.googleCalendarEventId,
        resource: gcalEvent,
    });
}

// Delete custom event
async function deleteCustomEvent(user, eventId) {
    const calendar = getGoogleCalendarClient(user);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
    });
}

// Get all calendar events for a period
async function getCalendarEvents(user, startDate, endDate) {
    const calendar = getGoogleCalendarClient(user);

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items;
}

module.exports = {
    getGoogleCalendarClient,
    createTaskEvent,
    updateTaskEvent,
    deleteTaskEvent,
    createRecurringCourseEvent,
    deleteCourseEvent,
    createCustomEvent,
    updateCustomEvent,
    deleteCustomEvent,
    getCalendarEvents,
};
