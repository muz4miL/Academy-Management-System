const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/students
// @desc    Get all students
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { class: className, group, status, search } = req.query;

        // Build query object
        let query = {};

        if (className && className !== 'all') {
            query.class = className;
        }

        if (group && group !== 'all') {
            query.group = group;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        const students = await Student.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message,
        });
    }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.json({
            success: true,
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student',
            error: error.message,
        });
    }
});

// @route   POST /api/students
// @desc    Create a new student
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: savedStudent,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating student',
            error: error.message,
        });
    }
});

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating student',
            error: error.message,
        });
    }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message,
        });
    }
});

// @route   GET /api/students/stats/overview
// @desc    Get student statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const activeStudents = await Student.countDocuments({ status: 'active' });
        const preMedical = await Student.countDocuments({ group: 'Pre-Medical' });
        const preEngineering = await Student.countDocuments({ group: 'Pre-Engineering' });

        res.json({
            success: true,
            data: {
                total: totalStudents,
                active: activeStudents,
                preMedical,
                preEngineering,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message,
        });
    }
});

module.exports = router;
