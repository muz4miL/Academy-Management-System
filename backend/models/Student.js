const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
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
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      enum: ['9th', '10th', '11th', '12th', 'MDCAT', 'ECAT'],
    },
    group: {
      type: String,
      required: true,
      enum: ['Pre-Medical', 'Pre-Engineering', 'Medical'],
    },
    subjects: [{
      type: String,
      trim: true,
    }],
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
    feeStatus: {
      type: String,
      enum: ['paid', 'partial', 'pending'],
      default: 'pending',
    },
    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Virtual field for balance
studentSchema.virtual('balance').get(function() {
  return this.totalFee - this.paidAmount;
});

// Ensure virtuals are included in JSON responses
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

// Index for faster queries
studentSchema.index({ studentId: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ class: 1, group: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
