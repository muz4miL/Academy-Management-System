const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    // Class identifier (auto-generated)
    classId: {
        type: String,
        unique: true,
    },

    // Class name (e.g., "9th Grade", "10th Grade", "MDCAT Prep")
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
    },

    // Section (e.g., "Medical", "Engineering", "Evening", "Morning")
    section: {
        type: String,
        required: [true, 'Section is required'],
        trim: true,
    },

    // Subjects offered in this class
    subjects: [{
        type: String,
        trim: true,
    }],

    // Base monthly fee for this class
    baseFee: {
        type: Number,
        default: 0,
        min: [0, 'Base fee cannot be negative'],
    },

    // Class status
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to generate classId and update timestamp
classSchema.pre('save', async function () {
    // Update timestamp
    this.updatedAt = new Date();

    // Generate classId if new document
    if (this.isNew && !this.classId) {
        try {
            // Find the highest existing classId
            const lastClass = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });

            let nextNumber = 1;
            if (lastClass && lastClass.classId) {
                const match = lastClass.classId.match(/CLS-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1], 10) + 1;
                }
            }

            this.classId = `CLS-${String(nextNumber).padStart(3, '0')}`;
            console.log(`✅ Generated classId: ${this.classId}`);
        } catch (error) {
            console.error('Error generating classId:', error);
            // Fallback to timestamp-based ID
            this.classId = `CLS-${Date.now()}`;
        }
    }
});

// Virtual for display name (e.g., "10th Grade - Medical")
classSchema.virtual('displayName').get(function () {
    return `${this.className} - ${this.section}`;
});

// Ensure virtuals are included in JSON output
classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
