// backend/config/constants.js
module.exports = {
    // App Config
    APP_NAME: 'StudenCal',
    APP_VERSION: '2.0.0',

    // API Config
    API_PREFIX: '/api',
    API_VERSION: 'v1',

    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,

    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,

    // Session
    SESSION_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days

    // Google Calendar
    GCAL_REMINDER_TIMES: [1440, 60], // 1 day, 1 hour before

    // Categories
    EXPENSE_CATEGORIES: [
        'Makanan',
        'Transportasi',
        'Buku & ATK',
        'Internet & Pulsa',
        'Hiburan',
        'Kesehatan',
        'Pakaian',
        'Lainnya',
    ],

    INCOME_CATEGORIES: [
        'Uang Saku',
        'Beasiswa',
        'Part-time',
        'Freelance',
        'Hadiah',
        'Lainnya',
    ],

    // Task Status
    TASK_STATUS: ['Todo', 'In Progress', 'Done'],

    // Days of Week
    DAYS_OF_WEEK: {
        1: 'Senin',
        2: 'Selasa',
        3: 'Rabu',
        4: 'Kamis',
        5: 'Jumat',
        6: 'Sabtu',
        7: 'Minggu',
    },

    // Grade Scale
    GRADE_SCALE: {
        A: { min: 85, max: 100 },
        'A-': { min: 80, max: 84.99 },
        'B+': { min: 75, max: 79.99 },
        B: { min: 70, max: 74.99 },
        'B-': { min: 65, max: 69.99 },
        'C+': { min: 60, max: 64.99 },
        C: { min: 55, max: 59.99 },
        D: { min: 50, max: 54.99 },
        E: { min: 0, max: 49.99 },
    },
};
