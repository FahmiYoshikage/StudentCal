// ============================================
// backend/scripts/seedData.js
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Grade = require('../models/Grade');
const Exam = require('../models/Exam');
const Habit = require('../models/Habit');
const Transaction = require('../models/Transaction');

const seedData = async (userId) => {
    try {
        console.log('🌱 Starting data seeding...');

        if (!userId) {
            console.error('❌ Please provide userId as argument');
            console.log('Usage: node seedData.js <userId>');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data for this user
        console.log('\n🧹 Clearing existing data...');
        await Course.deleteMany({ userId });
        await Task.deleteMany({ userId });
        await Event.deleteMany({ userId });
        await Grade.deleteMany({ userId });
        await Exam.deleteMany({ userId });
        await Habit.deleteMany({ userId });
        await Transaction.deleteMany({ userId });

        // Seed Courses
        console.log('\n📚 Seeding courses...');
        const semesterStart = new Date('2024-09-01');
        const semesterEnd = new Date('2024-12-31');

        const courses = await Course.insertMany([
            {
                userId,
                courseName: 'Data Structures & Algorithms',
                courseCode: 'CS201',
                instructor: 'Dr. Sarah Johnson',
                credits: 4,
                dayOfWeek: 1, // Monday
                startTime: '08:00',
                endTime: '10:00',
                location: 'Room A301',
                color: '#8b5cf6',
                semesterStart,
                semesterEnd,
            },
            {
                userId,
                courseName: 'Database Systems',
                courseCode: 'CS202',
                instructor: 'Prof. Michael Chen',
                credits: 3,
                dayOfWeek: 2, // Tuesday
                startTime: '13:00',
                endTime: '15:00',
                location: 'Lab B105',
                color: '#ec4899',
                semesterStart,
                semesterEnd,
            },
            {
                userId,
                courseName: 'Web Development',
                courseCode: 'CS203',
                instructor: 'Dr. Emily Rodriguez',
                credits: 3,
                dayOfWeek: 3, // Wednesday
                startTime: '10:00',
                endTime: '12:00',
                location: 'Room C202',
                color: '#06b6d4',
                semesterStart,
                semesterEnd,
            },
            {
                userId,
                courseName: 'Software Engineering',
                courseCode: 'CS301',
                instructor: 'Prof. David Kim',
                credits: 4,
                dayOfWeek: 4, // Thursday
                startTime: '08:00',
                endTime: '10:00',
                location: 'Room A401',
                color: '#10b981',
                semesterStart,
                semesterEnd,
            },
        ]);
        console.log(`✅ Created ${courses.length} courses`);

        // Seed Tasks
        console.log('\n📝 Seeding tasks...');
        const tasks = await Task.insertMany([
            {
                userId,
                courseId: courses[0]._id,
                title: 'Assignment 1: Linked Lists',
                description: 'Implement singly and doubly linked lists',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                priority: 'High',
                status: 'In Progress',
                subtasks: [
                    { text: 'Read chapter 3', completed: true },
                    { text: 'Implement singly linked list', completed: true },
                    { text: 'Implement doubly linked list', completed: false },
                    { text: 'Write unit tests', completed: false },
                ],
            },
            {
                userId,
                courseId: courses[1]._id,
                title: 'Database Design Project',
                description: 'Design and implement a library management system',
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                priority: 'High',
                status: 'Todo',
                driveLink: 'https://docs.google.com/document/d/example',
            },
            {
                userId,
                courseId: courses[2]._id,
                title: 'Build Portfolio Website',
                description: 'Create a responsive portfolio using React',
                deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                priority: 'Medium',
                status: 'Todo',
            },
        ]);
        console.log(`✅ Created ${tasks.length} tasks`);

        // Seed Grades
        console.log('\n📊 Seeding grades...');
        const grades = await Grade.insertMany([
            {
                userId,
                courseId: courses[0]._id,
                componentName: 'Quiz 1',
                score: 85,
                maxScore: 100,
                weight: 10,
            },
            {
                userId,
                courseId: courses[0]._id,
                componentName: 'Assignment 1',
                score: 90,
                maxScore: 100,
                weight: 15,
            },
            {
                userId,
                courseId: courses[1]._id,
                componentName: 'Midterm Exam',
                score: 78,
                maxScore: 100,
                weight: 30,
            },
        ]);
        console.log(`✅ Created ${grades.length} grades`);

        // Seed Exams
        console.log('\n🎯 Seeding exams...');
        const exams = await Exam.insertMany([
            {
                userId,
                courseId: courses[0]._id,
                examName: 'Final Exam - Data Structures',
                examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: 'Main Hall',
                studyMaterials: [
                    'Chapters 1-10',
                    'All lecture slides',
                    'Practice problems',
                ],
            },
            {
                userId,
                courseId: courses[1]._id,
                examName: 'Database Systems Midterm',
                examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                location: 'Room B201',
                studyMaterials: ['SQL queries', 'Normalization', 'ER diagrams'],
            },
        ]);
        console.log(`✅ Created ${exams.length} exams`);

        // Seed Habits
        console.log('\n🌟 Seeding habits...');
        const habits = await Habit.insertMany([
            {
                userId,
                habitName: 'Morning Study Session',
                goalDays: [1, 2, 3, 4, 5], // Weekdays
                icon: '📚',
                color: '#8b5cf6',
            },
            {
                userId,
                habitName: 'Exercise',
                goalDays: [1, 3, 5], // Mon, Wed, Fri
                icon: '💪',
                color: '#10b981',
            },
            {
                userId,
                habitName: 'Read Technical Articles',
                goalDays: [1, 2, 3, 4, 5, 6, 7], // Everyday
                icon: '📖',
                color: '#06b6d4',
            },
        ]);
        console.log(`✅ Created ${habits.length} habits`);

        // Seed Transactions
        console.log('\n💰 Seeding transactions...');
        const transactions = await Transaction.insertMany([
            {
                userId,
                type: 'Pemasukan',
                amount: 1000000,
                category: 'Uang Saku',
                description: 'Monthly allowance',
                date: new Date(),
            },
            {
                userId,
                type: 'Pengeluaran',
                amount: 150000,
                category: 'Buku',
                description: 'Textbooks for semester',
                date: new Date(),
            },
            {
                userId,
                type: 'Pengeluaran',
                amount: 50000,
                category: 'Makanan',
                description: 'Lunch this week',
                date: new Date(),
            },
            {
                userId,
                type: 'Pengeluaran',
                amount: 30000,
                category: 'Transportasi',
                description: 'Bus fare',
                date: new Date(),
            },
        ]);
        console.log(`✅ Created ${transactions.length} transactions`);

        // Seed Events
        console.log('\n📅 Seeding events...');
        const events = await Event.insertMany([
            {
                userId,
                title: 'Study Group - Algorithms',
                description: 'Group study session for upcoming quiz',
                startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(
                    Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
                ),
                location: 'Library Room 3',
                color: '#f59e0b',
            },
            {
                userId,
                title: 'Tech Workshop',
                description: 'React.js workshop by tech community',
                startDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
                ),
                location: 'Innovation Center',
                color: '#ef4444',
            },
        ]);
        console.log(`✅ Created ${events.length} events`);

        console.log('\n🎉 Data seeding completed successfully!');
        console.log(`
📊 Summary:
- Courses: ${courses.length}
- Tasks: ${tasks.length}
- Grades: ${grades.length}
- Exams: ${exams.length}
- Habits: ${habits.length}
- Transactions: ${transactions.length}
- Events: ${events.length}
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Get userId from command line argument
const userId = process.argv[2];
seedData(userId);
