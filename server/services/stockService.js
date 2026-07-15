const axios = require('axios');
const Stock = require('../models/stockSchema');

const fallbackStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 225.4, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 449.8, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 187.3, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 196.5, stockExchange: 'NASDAQ', sector: 'Consumer Discretionary' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 241.2, stockExchange: 'NASDAQ', sector: 'Automotive' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 512.8, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 128.6, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 655.3, stockExchange: 'NASDAQ', sector: 'Communication Services' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', price: 168.4, stockExchange: 'NASDAQ', sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 33.2, stockExchange: 'NASDAQ', sector: 'Technology' },
];

const priceSeed = {
  AAPL: 0.42,
  MSFT: -0.18,
  GOOGL: 0.31,
  AMZN: -0.14,
  TSLA: 0.55,
  META: 0.22,
  NVDA: 0.62,
  NFLX: -0.09,
  AMD: 0.28,
  INTC: -0.11,
};

function createHistoricalData(basePrice, symbol) {
  const data = [];
  const variation = priceSeed[symbol] ?? 0.1;
  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const drift = Math.sin(index / 3) * variation * 2;
    const close = Number((basePrice * (1 + drift / 100)).toFixed(2));
    const open = Number((close * (1 - 0.006)).toFixed(2));
    const high = Number((close * (1 + 0.012)).toFixed(2));
    const low = Number((close * (1 - 0.015)).toFixed(2));
    data.push({
      date,
      open,
      high,
      low,
      close,
      volume: Math.round(5000000 + index * 50000 + variation * 100000),
    });
  }
  return data;
}

function buildFallbackDoc(stockData) {
  const historicalData = createHistoricalData(stockData.price, stockData.symbol);
  const previousClose = historicalData[historicalData.length - 2]?.close ?? stockData.price;
  const latestClose = historicalData[historicalData.length - 1]?.close ?? stockData.price;
  const change = Number((latestClose - previousClose).toFixed(2));
  const changePercent = Number(((change / previousClose) * 100).toFixed(2));
  return {
    symbol: stockData.symbol,
    name: stockData.name,
    price: latestClose,
    stockExchange: stockData.stockExchange,
    sector: stockData.sector,
    currency: 'USD',
    previousClose,
    change,
    changePercent,
    historicalData,
    source: 'fallback',
    marketStatus: 'DEMO',
  };
}

async function seedFallbackStocks() {
  const created = [];
  for (const stockData of fallbackStocks) {
    const doc = buildFallbackDoc(stockData);
    const saved = await Stock.findOneAndUpdate(
      { symbol: doc.symbol },
      { $set: doc },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    created.push(saved);
  }
  return created;
}

async function syncExternalPrice(stock) {
  const apiKey = process.env.STOCK_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const response = await axios.get('https://api.example.com/stock/latest', {
      params: { symbol: stock.symbol, token: apiKey },
      timeout: 5000,
    });
    const latest = response.data;
    if (!latest || typeof latest.price !== 'number') {
      return null;
    }
    const previousClose = typeof latest.previousClose === 'number' ? latest.previousClose : stock.price;
    const change = Number((latest.price - previousClose).toFixed(2));
    const changePercent = previousClose ? Number(((change / previousClose) * 100).toFixed(2)) : 0;
    stock.price = latest.price;
    stock.previousClose = previousClose;
    stock.change = change;
    stock.changePercent = changePercent;
    stock.marketStatus = 'LIVE';
    stock.source = 'api';
    await stock.save();
    return stock;
  } catch (error) {
    return null;
  }
}

async function getAllStocks() {
  let stocks = await Stock.find({}).sort({ symbol: 1 });
  if (!stocks.length) {
    stocks = await seedFallbackStocks();
  }

  const updatedStocks = [];
  for (const stock of stocks) {
    const external = await syncExternalPrice(stock);
    if (external) {
      updatedStocks.push(external);
      continue;
    }
    if (!stock.historicalData || !stock.historicalData.length) {
      const fallback = buildFallbackDoc(stock.toObject ? stock.toObject() : stock);
      stock.historicalData = fallback.historicalData;
      stock.previousClose = fallback.previousClose;
      stock.change = fallback.change;
      stock.changePercent = fallback.changePercent;
      stock.source = stock.source || 'fallback';
      stock.marketStatus = 'DEMO';
      await stock.save();
    }
    updatedStocks.push(stock);
  }
  return updatedStocks;
}

async function searchStocks(query) {
  const normalized = query.trim().toUpperCase();
  return Stock.find({
    $or: [
      { symbol: new RegExp(normalized, 'i') },
      { name: new RegExp(query.trim(), 'i') },
    ],
  }).sort({ symbol: 1 });
}

async function getStockBySymbol(symbol) {
  const normalized = symbol.trim().toUpperCase();
  let stock = await Stock.findOne({ symbol: normalized });
  if (!stock) {
    const fallback = fallbackStocks.find((item) => item.symbol === normalized);
    if (!fallback) {
      return null;
    }
    stock = await Stock.create(buildFallbackDoc(fallback));
  }
  const external = await syncExternalPrice(stock);
  return external || stock;
}

function calculateSma(values, period, index) {
  if (index + 1 < period) {
    return null;
  }
  const slice = values.slice(index - period + 1, index + 1);
  const total = slice.reduce((sum, value) => sum + value, 0);
  return total / period;
}

function analyzeStrategy(history, shortWindow = 5, longWindow = 20) {
  const closes = history.map((point) => point.close);
  let position = false;
  let entryPrice = 0;
  let trades = 0;
  let strategyReturn = 0;
  const signals = [];

  for (let index = 0; index < closes.length; index += 1) {
    const shortSma = calculateSma(closes, shortWindow, index);
    const longSma = calculateSma(closes, longWindow, index);
    if (shortSma == null || longSma == null) {
      continue;
    }

    const previousShort = calculateSma(closes, shortWindow, index - 1);
    const previousLong = calculateSma(closes, longWindow, index - 1);
    const currentClose = closes[index];

    const crossAbove = previousShort != null && previousLong != null && previousShort <= previousLong && shortSma > longSma;
    const crossBelow = previousShort != null && previousLong != null && previousShort >= previousLong && shortSma < longSma;

    if (crossAbove && !position) {
      position = true;
      entryPrice = currentClose;
      trades += 1;
      signals.push({ index, action: 'BUY', price: currentClose });
    }

    if (crossBelow && position) {
      position = false;
      const returnPct = ((currentClose - entryPrice) / entryPrice) * 100;
      strategyReturn += returnPct;
      trades += 1;
      signals.push({ index, action: 'SELL', price: currentClose });
    }
  }

  if (position) {
    const finalPrice = closes[closes.length - 1];
    strategyReturn += ((finalPrice - entryPrice) / entryPrice) * 100;
  }

  const buyAndHoldReturn = closes.length > 1 ? ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100 : 0;

  return {
    strategy: 'SMA_CROSSOVER',
    period: {
      start: history[0]?.date,
      end: history[history.length - 1]?.date,
    },
    trades,
    signals,
    strategyReturn: Number(strategyReturn.toFixed(2)),
    buyAndHoldReturn: Number(buyAndHoldReturn.toFixed(2)),
    interpretation:
      strategyReturn > buyAndHoldReturn
        ? 'The SMA crossover outperformed buy-and-hold on this sample period.'
        : 'The SMA crossover underperformed buy-and-hold on this sample period.',
    disclaimer: 'For educational and simulation purposes only. Not financial advice.',
  };
}

module.exports = {
  fallbackStocks,
  createHistoricalData,
  buildFallbackDoc,
  seedFallbackStocks,
  getAllStocks,
  searchStocks,
  getStockBySymbol,
  analyzeStrategy,
};
