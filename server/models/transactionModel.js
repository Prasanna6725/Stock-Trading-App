const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
    },
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      default: 'VIRTUAL_BALANCE',
    },
    time: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
