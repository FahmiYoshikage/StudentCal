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
