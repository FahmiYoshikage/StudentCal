// models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        componentName: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
        },
        maxScore: {
            type: Number,
            required: true,
            min: 0,
        },
        weight: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

gradeSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model('Grade', gradeSchema);

// routes/grades.js
const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Course = require('../models/Course');

// GET all grades for current user
router.get('/', async (req, res) => {
    try {
        const { courseId } = req.query;

        const query = { userId: req.user._id };
        if (courseId) {
            query.courseId = courseId;
        }

        const grades = await Grade.find(query)
            .populate('courseId', 'courseName courseCode')
            .sort({ createdAt: -1 });

        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET grades by course with calculated average
router.get('/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course belongs to user
        const course = await Course.findOne({
            _id: courseId,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const grades = await Grade.find({
            userId: req.user._id,
            courseId: courseId,
        }).sort({ createdAt: 1 });

        // Calculate weighted average
        let totalWeightedScore = 0;
        let totalWeight = 0;

        grades.forEach((grade) => {
            const percentage = (grade.score / grade.maxScore) * 100;
            totalWeightedScore += (percentage * grade.weight) / 100;
            totalWeight += grade.weight;
        });

        const averageScore = totalWeight > 0 ? totalWeightedScore : 0;

        // Calculate letter grade
        let letterGrade = 'N/A';
        if (totalWeight >= 100) {
            if (averageScore >= 85) letterGrade = 'A';
            else if (averageScore >= 80) letterGrade = 'A-';
            else if (averageScore >= 75) letterGrade = 'B+';
            else if (averageScore >= 70) letterGrade = 'B';
            else if (averageScore >= 65) letterGrade = 'B-';
            else if (averageScore >= 60) letterGrade = 'C+';
            else if (averageScore >= 55) letterGrade = 'C';
            else if (averageScore >= 50) letterGrade = 'D';
            else letterGrade = 'E';
        }

        res.json({
            course: {
                _id: course._id,
                courseName: course.courseName,
                courseCode: course.courseCode,
            },
            grades,
            statistics: {
                averageScore: averageScore.toFixed(2),
                letterGrade,
                totalWeight,
                isComplete: totalWeight >= 100,
                componentsCount: grades.length,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new grade
router.post('/', async (req, res) => {
    try {
        const { courseId, componentName, score, maxScore, weight } = req.body;

        // Validate required fields
        if (
            !courseId ||
            !componentName ||
            score === undefined ||
            !maxScore ||
            !weight
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if course belongs to user
        const course = await Course.findOne({
            _id: courseId,
            userId: req.user._id,
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if total weight would exceed 100%
        const existingGrades = await Grade.find({
            userId: req.user._id,
            courseId: courseId,
        });

        const currentTotalWeight = existingGrades.reduce(
            (sum, g) => sum + g.weight,
            0
        );
        if (currentTotalWeight + weight > 100) {
            return res.status(400).json({
                error: `Total weight would exceed 100%. Current: ${currentTotalWeight}%, Adding: ${weight}%`,
            });
        }

        const grade = await Grade.create({
            userId: req.user._id,
            courseId,
            componentName,
            score,
            maxScore,
            weight,
        });

        const populatedGrade = await Grade.findById(grade._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.status(201).json({
            message: 'Grade added successfully',
            grade: populatedGrade,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update grade
router.put('/:id', async (req, res) => {
    try {
        const grade = await Grade.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        const { componentName, score, maxScore, weight } = req.body;

        // If weight is being changed, check total weight
        if (weight !== undefined && weight !== grade.weight) {
            const otherGrades = await Grade.find({
                userId: req.user._id,
                courseId: grade.courseId,
                _id: { $ne: grade._id },
            });

            const otherWeightsTotal = otherGrades.reduce(
                (sum, g) => sum + g.weight,
                0
            );
            if (otherWeightsTotal + weight > 100) {
                return res.status(400).json({
                    error: `Total weight would exceed 100%`,
                });
            }
        }

        // Update fields
        if (componentName) grade.componentName = componentName;
        if (score !== undefined) grade.score = score;
        if (maxScore) grade.maxScore = maxScore;
        if (weight !== undefined) grade.weight = weight;

        await grade.save();

        const populatedGrade = await Grade.findById(grade._id).populate(
            'courseId',
            'courseName courseCode'
        );

        res.json({
            message: 'Grade updated successfully',
            grade: populatedGrade,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE grade
router.delete('/:id', async (req, res) => {
    try {
        const grade = await Grade.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        await Grade.deleteOne({ _id: grade._id });

        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET summary of all courses with grades
router.get('/summary', async (req, res) => {
    try {
        const courses = await Course.find({ userId: req.user._id });

        const summary = await Promise.all(
            courses.map(async (course) => {
                const grades = await Grade.find({
                    userId: req.user._id,
                    courseId: course._id,
                });

                let totalWeightedScore = 0;
                let totalWeight = 0;

                grades.forEach((grade) => {
                    const percentage = (grade.score / grade.maxScore) * 100;
                    totalWeightedScore += (percentage * grade.weight) / 100;
                    totalWeight += grade.weight;
                });

                const averageScore = totalWeight > 0 ? totalWeightedScore : 0;

                let letterGrade = 'N/A';
                if (totalWeight >= 100) {
                    if (averageScore >= 85) letterGrade = 'A';
                    else if (averageScore >= 80) letterGrade = 'A-';
                    else if (averageScore >= 75) letterGrade = 'B+';
                    else if (averageScore >= 70) letterGrade = 'B';
                    else if (averageScore >= 65) letterGrade = 'B-';
                    else if (averageScore >= 60) letterGrade = 'C+';
                    else if (averageScore >= 55) letterGrade = 'C';
                    else if (averageScore >= 50) letterGrade = 'D';
                    else letterGrade = 'E';
                }

                return {
                    courseId: course._id,
                    courseName: course.courseName,
                    courseCode: course.courseCode,
                    averageScore: averageScore.toFixed(2),
                    letterGrade,
                    totalWeight,
                    isComplete: totalWeight >= 100,
                    componentsCount: grades.length,
                };
            })
        );

        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
