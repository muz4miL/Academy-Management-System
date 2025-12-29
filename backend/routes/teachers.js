const express = require('express');
const router = express.Router();
const {
    getTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
} = require('../controllers/teacherController');

// @route   GET /api/teachers
// @desc    Get all teachers
router.get('/', getTeachers);

// @route   GET /api/teachers/:id
// @desc    Get single teacher
router.get('/:id', getTeacherById);

// @route   POST /api/teachers
// @desc    Create new teacher
router.post('/', createTeacher);

// @route   PUT /api/teachers/:id
// @desc    Update teacher
router.put('/:id', updateTeacher);

// @route   DELETE /api/teachers/:id
// @desc    Delete teacher
router.delete('/:id', deleteTeacher);

module.exports = router;
