const mongoose = require('mongoose');

const historicalPointSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stockExchange: {
      type: String,
      trim: true,
      default: 'NASDAQ',
    },
    sector: {
      type: String,
      trim: true,
      default: '',
    },
    currency: {
      type: String,
      trim: true,
      default: 'USD',
    },
    previousClose: {
      type: Number,
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    historicalData: [historicalPointSchema],
    source: {
      type: String,
      enum: ['seed', 'api', 'fallback'],
      default: 'fallback',
    },
    marketStatus: {
      type: String,
      default: 'DEMO',
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
