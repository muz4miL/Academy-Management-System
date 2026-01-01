const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Expense title is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Utilities', 'Rent', 'Salaries', 'Stationery', 'Marketing', 'Misc'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Index for faster queries
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
