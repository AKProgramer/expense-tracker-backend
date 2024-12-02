const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }, // Reference to the group
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // Expense creator/admin
  splitDetails: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, // User involved in the split
    amount: {
      type: Number,
      required: true
    }, // Amount owed by this user to the creator
  }, ],
  balances: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    }, // Total amount this user owes to the creator
  }, ],
  createdAt: {
    type: Date,
    default: Date.now
  }, // Timestamp for when the expense was created
});

module.exports = mongoose.model('Expense', expenseSchema);