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

// ============================================
// backend/config/database.js
// ============================================
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

// ============================================
// backend/config/passport.js
// ============================================
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { encryptToken } = require('../utils/encryption');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.REDIRECT_URI,
                scope: [
                    'profile',
                    'email',
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar.settings.readonly',
                ],
                accessType: 'offline',
                prompt: 'consent',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // Update tokens
                        user.googleAccessToken = encryptToken(accessToken);
                        if (refreshToken) {
                            user.googleRefreshToken =
                                encryptToken(refreshToken);
                        }
                        await user.save();
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        displayName: profile.displayName,
                        avatarUrl: profile.photos[0]?.value,
                        googleAccessToken: encryptToken(accessToken),
                        googleRefreshToken: encryptToken(refreshToken),
                        settings: {
                            defaultReminderTime: 60,
                            timezone: 'Asia/Jakarta',
                        },
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
