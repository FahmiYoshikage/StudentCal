// ============================================
// backend/scripts/setupIndexes.js
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Course = require('../models/Course');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Grade = require('../models/Grade');
const Exam = require('../models/Exam');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Transaction = require('../models/Transaction');

const setupIndexes = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('\n📊 Creating indexes...\n');

        // User indexes
        console.log('Creating User indexes...');
        await User.createIndexes();
        console.log('✅ User indexes created');

        // Course indexes
        console.log('Creating Course indexes...');
        await Course.createIndexes();
        console.log('✅ Course indexes created');

        // Task indexes
        console.log('Creating Task indexes...');
        await Task.createIndexes();
        console.log('✅ Task indexes created');

        // Event indexes
        console.log('Creating Event indexes...');
        await Event.createIndexes();
        console.log('✅ Event indexes created');

        // Grade indexes
        console.log('Creating Grade indexes...');
        await Grade.createIndexes();
        console.log('✅ Grade indexes created');

        // Exam indexes
        console.log('Creating Exam indexes...');
        await Exam.createIndexes();
        console.log('✅ Exam indexes created');

        // Habit indexes
        console.log('Creating Habit indexes...');
        await Habit.createIndexes();
        console.log('✅ Habit indexes created');

        // HabitLog indexes
        console.log('Creating HabitLog indexes...');
        await HabitLog.createIndexes();
        console.log('✅ HabitLog indexes created');

        // Transaction indexes
        console.log('Creating Transaction indexes...');
        await Transaction.createIndexes();
        console.log('✅ Transaction indexes created');

        console.log('\n🎉 All indexes created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up indexes:', error);
        process.exit(1);
    }
};

setupIndexes();

