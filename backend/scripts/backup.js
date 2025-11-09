// ============================================
// backend/scripts/backup.js
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

const backup = async () => {
    try {
        console.log('💾 Starting database backup...');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create backup directory
        const backupDir = path.join(__dirname, '../backups');
        await fs.mkdir(backupDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

        console.log('\n📦 Fetching data...');

        // Fetch all data
        const data = {
            users: await User.find().lean(),
            courses: await Course.find().lean(),
            tasks: await Task.find().lean(),
            events: await Event.find().lean(),
            grades: await Grade.find().lean(),
            exams: await Exam.find().lean(),
            habits: await Habit.find().lean(),
            habitLogs: await HabitLog.find().lean(),
            transactions: await Transaction.find().lean(),
            backupDate: new Date(),
            version: '1.0',
        };

        // Calculate stats
        const stats = {
            users: data.users.length,
            courses: data.courses.length,
            tasks: data.tasks.length,
            events: data.events.length,
            grades: data.grades.length,
            exams: data.exams.length,
            habits: data.habits.length,
            habitLogs: data.habitLogs.length,
            transactions: data.transactions.length,
        };

        console.log('\n📊 Backup Statistics:');
        Object.entries(stats).forEach(([key, value]) => {
            console.log(`  ${key}: ${value} records`);
        });

        // Write to file
        await fs.writeFile(backupPath, JSON.stringify(data, null, 2));

        const fileStats = await fs.stat(backupPath);
        const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

        console.log(`\n✅ Backup completed successfully!`);
        console.log(`📁 File: ${backupPath}`);
        console.log(`📦 Size: ${fileSizeMB} MB`);

        // Clean old backups (keep last 10)
        const files = await fs.readdir(backupDir);
        const backupFiles = files
            .filter((f) => f.startsWith('backup-') && f.endsWith('.json'))
            .sort()
            .reverse();

        if (backupFiles.length > 10) {
            console.log('\n🧹 Cleaning old backups...');
            for (let i = 10; i < backupFiles.length; i++) {
                await fs.unlink(path.join(backupDir, backupFiles[i]));
                console.log(`  Deleted: ${backupFiles[i]}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    }
};

backup();
