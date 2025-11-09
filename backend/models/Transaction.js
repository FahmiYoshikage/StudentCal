// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['Pemasukan', 'Pengeluaran'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
        },
        description: String,
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions for current user
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, type, category } = req.query;

        const query = { userId: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (type) query.type = type;
        if (category) query.category = category;

        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET monthly summary
router.get('/summary/monthly', async (req, res) => {
    try {
        const { year, month } = req.query;

        // Default to current month if not specified
        const now = new Date();
        const targetYear = year ? parseInt(year) : now.getFullYear();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;

        // Calculate date range for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: endDate },
        });

        // Calculate totals
        let totalIncome = 0;
        let totalExpense = 0;
        const categoryBreakdown = {};

        transactions.forEach((transaction) => {
            if (transaction.type === 'Pemasukan') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;

                // Category breakdown for expenses
                if (!categoryBreakdown[transaction.category]) {
                    categoryBreakdown[transaction.category] = 0;
                }
                categoryBreakdown[transaction.category] += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        res.json({
            period: {
                year: targetYear,
                month: targetMonth,
                monthName: startDate.toLocaleString('id-ID', { month: 'long' }),
            },
            totalIncome,
            totalExpense,
            balance,
            transactionCount: transactions.length,
            categoryBreakdown,
            transactions: transactions.slice(0, 10), // Latest 10
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET yearly summary
router.get('/summary/yearly', async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const startDate = new Date(targetYear, 0, 1);
        const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: endDate },
        });

        // Monthly breakdown
        const monthlyData = Array(12)
            .fill(0)
            .map((_, index) => ({
                month: index + 1,
                monthName: new Date(targetYear, index, 1).toLocaleString(
                    'id-ID',
                    { month: 'short' }
                ),
                income: 0,
                expense: 0,
                balance: 0,
            }));

        transactions.forEach((transaction) => {
            const monthIndex = new Date(transaction.date).getMonth();
            if (transaction.type === 'Pemasukan') {
                monthlyData[monthIndex].income += transaction.amount;
            } else {
                monthlyData[monthIndex].expense += transaction.amount;
            }
            monthlyData[monthIndex].balance =
                monthlyData[monthIndex].income -
                monthlyData[monthIndex].expense;
        });

        const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
        const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);

        res.json({
            year: targetYear,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            monthlyData,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET categories list
router.get('/categories', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id });
        const categories = [...new Set(transactions.map((t) => t.category))];

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new transaction
router.post('/', async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        // Validate required fields
        if (!type || !amount || !category) {
            return res
                .status(400)
                .json({ error: 'Type, amount, and category are required' });
        }

        if (!['Pemasukan', 'Pengeluaran'].includes(type)) {
            return res.status(400).json({
                error: 'Type must be either "Pemasukan" or "Pengeluaran"',
            });
        }

        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            amount: parseFloat(amount),
            category,
            description,
            date: date ? new Date(date) : new Date(),
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const { type, amount, category, description, date } = req.body;

        // Update fields
        if (type) transaction.type = type;
        if (amount !== undefined) transaction.amount = parseFloat(amount);
        if (category) transaction.category = category;
        if (description !== undefined) transaction.description = description;
        if (date) transaction.date = new Date(date);

        await transaction.save();

        res.json({
            message: 'Transaction updated successfully',
            transaction,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await Transaction.deleteOne({ _id: transaction._id });

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
