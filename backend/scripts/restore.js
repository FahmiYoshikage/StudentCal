// ============================================
// backend/scripts/restore.js
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const User = require('../models/User');
const Course = require('../models/Course');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Grade = require('../models/Grade');
const Exam = require('../models/Exam');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Transaction = require('../models/Transaction');

const restore = async (backupFile) => {
    try {
        console.log('🔄 Starting database restore...');

        if (!backupFile) {
            console.error('❌ Please provide backup file path');
            console.log('Usage: node restore.js <backup-file-path>');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read backup file
        console.log('\n📖 Reading backup file...');
        const backupPath = path.isAbsolute(backupFile)
            ? backupFile
            : path.join(__dirname, '../backups', backupFile);

        const fileContent = await fs.readFile(backupPath, 'utf8');
        const data = JSON.parse(fileContent);

        console.log(`📅 Backup date: ${data.backupDate}`);
        console.log(`📦 Version: ${data.version}`);

        // Confirm restore
        console.log('\n⚠️  WARNING: This will DELETE all existing data!');
        console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await Task.deleteMany({});
        await Event.deleteMany({});
        await Grade.deleteMany({});
        await Exam.deleteMany({});
        await Habit.deleteMany({});
        await HabitLog.deleteMany({});
        await Transaction.deleteMany({});

        console.log('\n📥 Restoring data...');

        if (data.users?.length) await User.insertMany(data.users);
        if (data.courses?.length) await Course.insertMany(data.courses);
        if (data.tasks?.length) await Task.insertMany(data.tasks);
        if (data.events?.length) await Event.insertMany(data.events);
        if (data.grades?.length) await Grade.insertMany(data.grades);
        if (data.exams?.length) await Exam.insertMany(data.exams);
        if (data.habits?.length) await Habit.insertMany(data.habits);
        if (data.habitLogs?.length) await HabitLog.insertMany(data.habitLogs);
        if (data.transactions?.length)
            await Transaction.insertMany(data.transactions);

        console.log('\n✅ Restore completed successfully!');
        console.log(`
📊 Restored:
- Users: ${data.users?.length || 0}
- Courses: ${data.courses?.length || 0}
- Tasks: ${data.tasks?.length || 0}
- Events: ${data.events?.length || 0}
- Grades: ${data.grades?.length || 0}
- Exams: ${data.exams?.length || 0}
- Habits: ${data.habits?.length || 0}
- Habit Logs: ${data.habitLogs?.length || 0}
- Transactions: ${data.transactions?.length || 0}
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Restore failed:', error);
        process.exit(1);
    }
};

const backupFile = process.argv[2];
restore(backupFile);
