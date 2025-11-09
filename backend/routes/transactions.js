// ============================================
// backend/routes/transactions.js
// ============================================
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all transactions
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const { month, year } = req.query;
        let query = { userId: req.user._id };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json({ success: true, data: transactions });
    } catch (error) {
        next(error);
    }
});

// Get monthly summary
router.get(
    '/summary/:year/:month',
    ensureAuthenticated,
    async (req, res, next) => {
        try {
            const { year, month } = req.params;
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);

            const transactions = await Transaction.find({
                userId: req.user._id,
                date: { $gte: startDate, $lte: endDate },
            });

            const income = transactions
                .filter((t) => t.type === 'Pemasukan')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter((t) => t.type === 'Pengeluaran')
                .reduce((sum, t) => sum + t.amount, 0);

            // Category breakdown
            const categoryBreakdown = {};
            transactions.forEach((t) => {
                if (!categoryBreakdown[t.category]) {
                    categoryBreakdown[t.category] = {
                        type: t.type,
                        total: 0,
                        count: 0,
                    };
                }
                categoryBreakdown[t.category].total += t.amount;
                categoryBreakdown[t.category].count++;
            });

            res.json({
                success: true,
                data: {
                    income,
                    expense,
                    balance: income - expense,
                    categoryBreakdown,
                    transactionCount: transactions.length,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get yearly summary
router.get('/summary/:year', ensureAuthenticated, async (req, res, next) => {
    try {
        const { year } = req.params;
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: endDate },
        });

        // Monthly breakdown
        const monthlyData = Array(12)
            .fill(null)
            .map((_, i) => ({
                month: i + 1,
                income: 0,
                expense: 0,
            }));

        transactions.forEach((t) => {
            const month = new Date(t.date).getMonth();
            if (t.type === 'Pemasukan') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });

        const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
        const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                monthlyData,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Create transaction
router.post('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            userId: req.user._id,
        });
        await transaction.save();
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
});

// Update transaction
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res
                .status(404)
                .json({ success: false, message: 'Transaction not found' });
        }

        Object.assign(transaction, req.body);
        await transaction.save();
        res.json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
});

// Delete transaction
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res
                .status(404)
                .json({ success: false, message: 'Transaction not found' });
        }

        await transaction.deleteOne();
        res.json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
