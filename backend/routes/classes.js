const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// @route   GET /api/classes
// @desc    Get all classes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;

        // Build query object
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { className: { $regex: search, $options: 'i' } },
                { section: { $regex: search, $options: 'i' } },
            ];
        }

        const classes = await Class.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: classes.length,
            data: classes,
        });
    } catch (error) {
        console.error('❌ Error fetching classes:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching classes',
            error: error.message,
        });
    }
});

// @route   GET /api/classes/:id
// @desc    Get single class by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const classDoc = await Class.findById(req.params.id);

        if (!classDoc) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            });
        }

        res.json({
            success: true,
            data: classDoc,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching class',
            error: error.message,
        });
    }
});

// @route   POST /api/classes
// @desc    Create a new class
// @access  Public
router.post('/', async (req, res) => {
    try {
        console.log('📥 Creating class:', JSON.stringify(req.body, null, 2));

        // Sanitize data
        const classData = { ...req.body };

        // Ensure subjects is an array
        if (typeof classData.subjects === 'string') {
            classData.subjects = classData.subjects
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }

        if (!Array.isArray(classData.subjects)) {
            classData.subjects = [];
        }

        // Ensure baseFee is a number
        if (classData.baseFee !== undefined) {
            classData.baseFee = Number(classData.baseFee) || 0;
        }

        // Remove classId if sent (will be auto-generated)
        delete classData.classId;

        const newClass = new Class(classData);
        const savedClass = await newClass.save();

        console.log('✅ Class created:', savedClass.classId);

        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: savedClass,
        });
    } catch (error) {
        console.error('❌ Error creating class:', error.message);
        res.status(400).json({
            success: false,
            message: 'Error creating class',
            error: error.message,
        });
    }
});

// @route   PUT /api/classes/:id
// @desc    Update a class
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        // Step 1: Find the class
        const classDoc = await Class.findById(req.params.id);

        if (!classDoc) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            });
        }

        // Step 2: Sanitize incoming data
        const updateData = { ...req.body };

        // Ensure subjects is an array
        if (typeof updateData.subjects === 'string') {
            updateData.subjects = updateData.subjects
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }

        // Ensure baseFee is a number
        if (updateData.baseFee !== undefined) {
            updateData.baseFee = Number(updateData.baseFee) || 0;
        }

        // Never allow frontend to override classId
        delete updateData.classId;
        delete updateData._id;

        console.log('📝 Updating class:', classDoc.classId);

        // Step 3: Apply updates
        Object.assign(classDoc, updateData);

        // Step 4: Save
        const updatedClass = await classDoc.save();

        console.log('✅ Class updated:', updatedClass.classId);

        res.json({
            success: true,
            message: 'Class updated successfully',
            data: updatedClass,
        });
    } catch (error) {
        console.error('❌ Error updating class:', error.message);
        res.status(400).json({
            success: false,
            message: 'Error updating class',
            error: error.message,
        });
    }
});

// @route   DELETE /api/classes/:id
// @desc    Delete a class
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            });
        }

        console.log('🗑️ Class deleted:', deletedClass.classId);

        res.json({
            success: true,
            message: 'Class deleted successfully',
            data: deletedClass,
        });
    } catch (error) {
        console.error('❌ Error deleting class:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting class',
            error: error.message,
        });
    }
});

// @route   GET /api/classes/stats/overview
// @desc    Get class statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
    try {
        const totalClasses = await Class.countDocuments();
        const activeClasses = await Class.countDocuments({ status: 'active' });

        res.json({
            success: true,
            data: {
                total: totalClasses,
                active: activeClasses,
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
