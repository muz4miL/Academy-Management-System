const express = require('express');
const router = express.Router();
const FinanceRecord = require('../models/FinanceRecord');

// @route   GET /api/finance
// @desc    Get all finance records
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, month, year } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (month) {
            query.month = month;
        }

        if (year) {
            query.year = parseInt(year);
        }

        const records = await FinanceRecord.find(query)
            .populate('studentId', 'name class')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching finance records',
            error: error.message,
        });
    }
});

// @route   GET /api/finance/:id
// @desc    Get single finance record by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const record = await FinanceRecord.findById(req.params.id)
            .populate('studentId', 'name class');

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Finance record not found',
            });
        }

        res.json({
            success: true,
            data: record,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching finance record',
            error: error.message,
        });
    }
});

// @route   POST /api/finance
// @desc    Create a new finance record
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newRecord = new FinanceRecord(req.body);
        const savedRecord = await newRecord.save();

        res.status(201).json({
            success: true,
            message: 'Finance record created successfully',
            data: savedRecord,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating finance record',
            error: error.message,
        });
    }
});

// @route   PUT /api/finance/:id
// @desc    Update a finance record
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const updatedRecord = await FinanceRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: 'Finance record not found',
            });
        }

        res.json({
            success: true,
            message: 'Finance record updated successfully',
            data: updatedRecord,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating finance record',
            error: error.message,
        });
    }
});

// @route   DELETE /api/finance/:id
// @desc    Delete a finance record
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedRecord = await FinanceRecord.findByIdAndDelete(req.params.id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: 'Finance record not found',
            });
        }

        res.json({
            success: true,
            message: 'Finance record deleted successfully',
            data: deletedRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting finance record',
            error: error.message,
        });
    }
});

// @route   GET /api/finance/stats/overview
// @desc    Get finance statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
    try {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const currentYear = new Date().getFullYear();

        // Total income (sum of all paid amounts for current month)
        const totalIncomeResult = await FinanceRecord.aggregate([
            {
                $match: {
                    month: currentMonth,
                    year: currentYear,
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$paidAmount' },
                },
            },
        ]);

        const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

        // Pending fees (sum of all balances)
        const pendingFeesResult = await FinanceRecord.aggregate([
            {
                $match: {
                    status: { $in: ['pending', 'partial'] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalPending: { $sum: '$balance' },
                },
            },
        ]);

        const pendingFees = pendingFeesResult[0]?.totalPending || 0;

        // Count students with pending fees
        const pendingStudentsCount = await FinanceRecord.countDocuments({
            status: { $in: ['pending', 'partial'] },
        });

        res.json({
            success: true,
            data: {
                totalIncome,
                pendingFees,
                pendingStudentsCount,
                teacherShare: totalIncome * 0.7,
                academyShare: totalIncome * 0.3,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching finance statistics',
            error: error.message,
        });
    }
});

module.exports = router;
