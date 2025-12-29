const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
    {
        // Academy Identity
        academyName: {
            type: String,
            default: 'Academy Management System',
            required: true,
            trim: true,
        },
        contactEmail: {
            type: String,
            default: 'admin@academy.com',
            required: true,
            lowercase: true,
            trim: true,
        },
        contactPhone: {
            type: String,
            default: '+92 321 1234567',
            required: true,
            trim: true,
        },
        currency: {
            type: String,
            default: 'PKR',
            enum: ['PKR', 'USD'],
            required: true,
        },

        // Teacher Compensation Defaults
        defaultCompensationMode: {
            type: String,
            enum: ['percentage', 'fixed'],
            default: 'percentage',
            required: true,
        },
        defaultTeacherShare: {
            type: Number,
            default: 70,
            min: 0,
            max: 100,
        },
        defaultAcademyShare: {
            type: Number,
            default: 30,
            min: 0,
            max: 100,
        },
        defaultBaseSalary: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Student Financial Policies
        defaultLateFee: {
            type: Number,
            default: 500,
            min: 0,
            required: true,
        },
        feeDueDay: {
            type: String,
            default: '10',
            enum: ['1', '5', '10', '15'],
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Ensure only one settings document exists (Singleton pattern)
SettingsSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model('Settings', SettingsSchema);
