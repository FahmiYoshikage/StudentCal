// ============================================
// backend/middleware/rateLimiter.js
// ============================================
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
    skipSuccessfulRequests: true,
});

// Google Calendar sync limiter
const syncLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        message: 'Too many sync requests, please wait a moment.',
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    syncLimiter,
};
