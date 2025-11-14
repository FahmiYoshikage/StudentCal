// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        avatarUrl: String,
        googleAccessToken: {
            type: String,
            required: true,
        },
        googleRefreshToken: {
            type: String,
            required: true,
        },
        settings: {
            defaultReminderTime: {
                type: Number,
                default: 60,
            },
            timezone: {
                type: String,
                default: 'Asia/Jakarta',
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
