const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, startDate, endDate, limit } = req.query;

        let query = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .limit(limit ? parseInt(limit) : 100);

        // Calculate total
        const total = await Expense.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            count: expenses.length,
            totalAmount: total[0]?.totalAmount || 0,
            data: expenses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expenses',
            error: error.message,
        });
    }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        res.json({
            success: true,
            data: expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expense',
            error: error.message,
        });
    }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { title, category, amount, date, description } = req.body;

        // Validation
        if (!title || !category || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, category, and amount',
            });
        }

        const expense = new Expense({
            title,
            category,
            amount,
            date: date || new Date(),
            description,
        });

        await expense.save();

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            data: expense,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating expense',
            error: error.message,
        });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        res.json({
            success: true,
            message: 'Expense updated successfully',
            data: expense,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating expense',
            error: error.message,
        });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
            });
        }

        res.json({
            success: true,
            message: 'Expense deleted successfully',
            data: expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting expense',
            error: error.message,
        });
    }
});

module.exports = router;
