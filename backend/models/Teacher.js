const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
    {
        teacherId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        address: {
            type: String,
            trim: true,
        },
        qualification: {
            type: String,
            trim: true,
        },
        experience: {
            type: Number, // Years of experience
            min: 0,
        },
        studentCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        monthlyEarnings: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'on-leave'],
            default: 'active',
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        // Revenue share percentage (default 70%)
        revenueSharePercentage: {
            type: Number,
            default: 70,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ subject: 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
