// ============================================
// backend/routes/grades.js
// ============================================
const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Course = require('../models/Course');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all grades
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const grades = await Grade.find({ userId: req.user._id })
            .populate('courseId', 'courseName courseCode')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: grades });
    } catch (error) {
        next(error);
    }
});

// Get grades by course
router.get('/course/:courseId', ensureAuthenticated, async (req, res, next) => {
    try {
        const grades = await Grade.find({
            userId: req.user._id,
            courseId: req.params.courseId,
        }).sort({ createdAt: -1 });

        // Calculate course average
        const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
        const weightedSum = grades.reduce(
            (sum, g) => sum + (g.score / g.maxScore) * g.weight,
            0
        );
        const average = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

        // Get letter grade
        const getLetterGrade = (score) => {
            if (score >= 85) return 'A';
            if (score >= 80) return 'A-';
            if (score >= 75) return 'B+';
            if (score >= 70) return 'B';
            if (score >= 65) return 'B-';
            if (score >= 60) return 'C+';
            if (score >= 55) return 'C';
            if (score >= 40) return 'D';
            return 'E';
        };

        res.json({
            success: true,
            data: {
                grades,
                summary: {
                    average: average.toFixed(2),
                    letterGrade: getLetterGrade(average),
                    totalWeight,
                    componentCount: grades.length,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get course summary
router.get('/summary', ensureAuthenticated, async (req, res, next) => {
    try {
        const grades = await Grade.find({ userId: req.user._id }).populate(
            'courseId',
            'courseName courseCode'
        );

        // Group by course
        const courseMap = {};
        grades.forEach((grade) => {
            const courseId = grade.courseId._id.toString();
            if (!courseMap[courseId]) {
                courseMap[courseId] = {
                    course: grade.courseId,
                    grades: [],
                    totalWeight: 0,
                    weightedSum: 0,
                };
            }
            courseMap[courseId].grades.push(grade);
            courseMap[courseId].totalWeight += grade.weight;
            courseMap[courseId].weightedSum +=
                (grade.score / grade.maxScore) * grade.weight;
        });

        // Calculate averages
        const courseSummaries = Object.values(courseMap).map((course) => {
            const average =
                course.totalWeight > 0
                    ? (course.weightedSum / course.totalWeight) * 100
                    : 0;
            return {
                course: course.course,
                average: average.toFixed(2),
                totalWeight: course.totalWeight,
                componentCount: course.grades.length,
            };
        });

        res.json({ success: true, data: courseSummaries });
    } catch (error) {
        next(error);
    }
});

// Create grade
router.post('/', ensureAuthenticated, async (req, res, next) => {
    try {
        // Validate total weight doesn't exceed 100%
        const existingGrades = await Grade.find({
            userId: req.user._id,
            courseId: req.body.courseId,
        });

        const totalWeight =
            existingGrades.reduce((sum, g) => sum + g.weight, 0) +
            req.body.weight;
        if (totalWeight > 100) {
            return res.status(400).json({
                success: false,
                message: `Total weight cannot exceed 100%. Current: ${totalWeight}%`,
            });
        }

        const grade = new Grade({
            ...req.body,
            userId: req.user._id,
        });
        await grade.save();
        await grade.populate('courseId', 'courseName courseCode');

        res.status(201).json({ success: true, data: grade });
    } catch (error) {
        next(error);
    }
});

// Update grade
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const grade = await Grade.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!grade) {
            return res
                .status(404)
                .json({ success: false, message: 'Grade not found' });
        }

        // Validate weight if updating
        if (req.body.weight !== undefined) {
            const existingGrades = await Grade.find({
                userId: req.user._id,
                courseId: grade.courseId,
                _id: { $ne: grade._id },
            });

            const totalWeight =
                existingGrades.reduce((sum, g) => sum + g.weight, 0) +
                req.body.weight;
            if (totalWeight > 100) {
                return res.status(400).json({
                    success: false,
                    message: `Total weight cannot exceed 100%. Current: ${totalWeight}%`,
                });
            }
        }

        Object.assign(grade, req.body);
        await grade.save();
        await grade.populate('courseId');

        res.json({ success: true, data: grade });
    } catch (error) {
        next(error);
    }
});

// Delete grade
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const grade = await Grade.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!grade) {
            return res
                .status(404)
                .json({ success: false, message: 'Grade not found' });
        }

        await grade.deleteOne();
        res.json({ success: true, message: 'Grade deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
