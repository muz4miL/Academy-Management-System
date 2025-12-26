const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { subject, status } = req.query;

        let query = {};

        if (subject) {
            query.subject = subject;
        }

        if (status) {
            query.status = status;
        }

        const teachers = await Teacher.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: teachers.length,
            data: teachers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teachers',
            error: error.message,
        });
    }
});

// @route   GET /api/teachers/:id
// @desc    Get single teacher by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        res.json({
            success: true,
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teacher',
            error: error.message,
        });
    }
});

// @route   POST /api/teachers
// @desc    Create a new teacher
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newTeacher = new Teacher(req.body);
        const savedTeacher = await newTeacher.save();

        res.status(201).json({
            success: true,
            message: 'Teacher created successfully',
            data: savedTeacher,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating teacher',
            error: error.message,
        });
    }
});

// @route   PUT /api/teachers/:id
// @desc    Update a teacher
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        res.json({
            success: true,
            message: 'Teacher updated successfully',
            data: updatedTeacher,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating teacher',
            error: error.message,
        });
    }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete a teacher
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        res.json({
            success: true,
            message: 'Teacher deleted successfully',
            data: deletedTeacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting teacher',
            error: error.message,
        });
    }
});

module.exports = router;
