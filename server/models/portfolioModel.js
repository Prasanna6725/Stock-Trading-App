const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    averageBuyPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    holdings: {
      type: [holdingSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
