const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: false, // ✨ TASK 2: Relaxed to allow hook to complete first
      unique: true,
      trim: true,
    },
    studentName: {
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
    parentCell: {
      type: String,
      required: true,
      trim: true,
    },
    studentCell: {
      type: String,
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
studentSchema.virtual('balance').get(function () {
  return this.totalFee - this.paidAmount;
});

// Ensure virtuals are included in JSON responses
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

// ✨ FINAL FIX: ASYNC HOOK WITHOUT next()
// In modern Mongoose, async hooks do NOT use next()
studentSchema.pre('save', async function () {
  console.log('\n🛠️  PRE-SAVE HOOK TRIGGERED');
  console.log(`🛠️  GENERATING ID FOR: ${this.studentName}`);
  console.log(`🛠️  isNew: ${this.isNew}, Current ID: ${this.studentId || 'undefined'}`);

  // Only generate if this is a new document and studentId is not already set
  if (this.isNew && !this.studentId) {
    // Count total documents to handle empty collection case
    const count = await this.constructor.countDocuments();
    console.log(`🛠️  Total students in DB: ${count}`);

    if (count === 0) {
      // First student ever - immediately assign and continue
      this.studentId = 'STU-001';
      console.log('✅ GENERATED ID (First Student): STU-001');
    } else {
      // Find the last student by sorting createdAt in descending order
      const lastStudent = await this.constructor.findOne({})
        .sort({ createdAt: -1 })
        .select('studentId')
        .lean();

      console.log(`🛠️  Last student found: ${lastStudent ? lastStudent.studentId : 'none'}`);

      if (lastStudent && lastStudent.studentId) {
        // Extract number from last studentId (e.g., STU-001 -> 1)
        const match = lastStudent.studentId.match(/STU-(\d+)/);
        if (match) {
          const lastNumber = parseInt(match[1], 10);
          const newNumber = String(lastNumber + 1).padStart(3, '0');
          this.studentId = `STU-${newNumber}`;
          console.log(`✅ GENERATED ID (Incremented): STU-${newNumber} (from ${lastStudent.studentId})`);
        } else {
          // Fallback if format is unexpected
          this.studentId = 'STU-001';
          console.log('✅ GENERATED ID (Fallback): STU-001');
        }
      } else {
        // Fallback for first student
        this.studentId = 'STU-001';
        console.log('✅ GENERATED ID (Fallback - No last student): STU-001');
      }
    }
  } else {
    console.log(`⏭️  Skipping ID generation (isNew: ${this.isNew}, ID exists: ${!!this.studentId})`);
  }

  // Ensure totalFee and paidAmount are Numbers
  if (this.totalFee !== undefined) {
    this.totalFee = Number(this.totalFee);
  }
  if (this.paidAmount !== undefined) {
    this.paidAmount = Number(this.paidAmount);
  }


  // Auto-calculate feeStatus based on totalFee and paidAmount
  // 🔧 ROBUST LOGIC: Explicit handling for all scenarios
  const totalFee = Number(this.totalFee) || 0;
  const paidAmount = Number(this.paidAmount) || 0;

  // Scenario 1: No fee set (Quick Add with 0 fee) OR no payment → Pending
  if (totalFee === 0 || paidAmount === 0) {
    this.feeStatus = 'pending';
  }
  // Scenario 2: Fee set AND paid in full → Paid
  else if (totalFee > 0 && paidAmount >= totalFee) {
    this.feeStatus = 'paid';
  }
  // Scenario 3: Fee set AND partial payment → Partial
  else if (totalFee > 0 && paidAmount > 0) {
    this.feeStatus = 'partial';
  }
  // Fallback (should never reach here, but safety net)
  else {
    this.feeStatus = 'pending';
  }



  console.log(`✅ FINAL STATE BEFORE SAVE: ID=${this.studentId}, FeeStatus=${this.feeStatus}\n`);

  // ✨ NO next() call - async functions return automatically!
});

// DON'T recreate indexes here - they're being managed by the drop script
// Indexes will be created when needed by MongoDB

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
