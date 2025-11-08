// server.js - Main Express Server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        },
    })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ MongoDB Connected');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });

// Import Models
const User = require('./models/User');
const Course = require('./models/Course');
const Task = require('./models/Task');
const Event = require('./models/Event');

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
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
                        user.googleRefreshToken = encryptToken(refreshToken);
                    }
                    await user.save();
                } else {
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
                }

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

// Token Encryption/Decryption
const crypto = require('crypto');

function encryptToken(token) {
    const cipher = crypto.createCipher(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY
    );
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decryptToken(encryptedToken) {
    const decipher = crypto.createDecipher(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY
    );
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// ========== AUTHENTICATION ROUTES ==========
app.get('/auth/google', passport.authenticate('google'));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect(
            process.env.FRONTEND_URL || 'http://localhost:3000/dashboard'
        );
    }
);

app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/auth/me', isAuthenticated, (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl,
        settings: req.user.settings,
    });
});

// ========== COURSES ROUTES ==========
const coursesRouter = require('./routes/courses');
app.use('/api/courses', isAuthenticated, coursesRouter);

// ========== TASKS ROUTES ==========
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', isAuthenticated, tasksRouter);

// ========== EVENTS ROUTES ==========
const eventsRouter = require('./routes/events');
app.use('/api/events', isAuthenticated, eventsRouter);

// ========== CALENDAR ROUTES ==========
const calendarRouter = require('./routes/calendar');
app.use('/api/calendar', isAuthenticated, calendarRouter);

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
