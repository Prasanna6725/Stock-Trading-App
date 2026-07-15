const Portfolio = require('../models/portfolioModel');
const Stock = require('../models/stockSchema');
const Transaction = require('../models/transactionModel');

async function buildPortfolioSummary(portfolioDoc) {
  const portfolio = portfolioDoc.toObject ? portfolioDoc.toObject() : portfolioDoc;
  const holdings = [];
  let totalInvested = 0;
  let currentValue = 0;

  for (const holding of portfolio.holdings || []) {
    const stock = holding.stock ? await Stock.findById(holding.stock) : await Stock.findOne({ symbol: holding.symbol });
    const currentPrice = stock ? stock.price : holding.averageBuyPrice;
    const investedValue = holding.quantity * holding.averageBuyPrice;
    const holdingCurrentValue = holding.quantity * currentPrice;
    const profitLoss = holdingCurrentValue - investedValue;
    const profitLossPercent = investedValue ? (profitLoss / investedValue) * 100 : 0;

    totalInvested += investedValue;
    currentValue += holdingCurrentValue;

    holdings.push({
      ...holding,
      stock,
      currentPrice,
      investedValue: Number(investedValue.toFixed(2)),
      currentValue: Number(holdingCurrentValue.toFixed(2)),
      profitLoss: Number(profitLoss.toFixed(2)),
      profitLossPercent: Number(profitLossPercent.toFixed(2)),
    });
  }

  const profitLoss = currentValue - totalInvested;
  const profitLossPercent = totalInvested ? (profitLoss / totalInvested) * 100 : 0;
  const transactions = await Transaction.find({ portfolio: portfolio._id }).sort({ createdAt: -1 }).limit(5);

  return {
    ...portfolio,
    holdings,
    totals: {
      totalInvested: Number(totalInvested.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      profitLoss: Number(profitLoss.toFixed(2)),
      profitLossPercent: Number(profitLossPercent.toFixed(2)),
    },
    recentTransactions: transactions,
  };
}

async function createPortfolio(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Portfolio name is required' });
    }

    const portfolio = await Portfolio.create({
      user: req.user._id,
      name: name.trim(),
      description: description ? description.trim() : '',
    });

    return res.status(201).json({ success: true, message: 'Portfolio created', data: portfolio });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to create portfolio' });
  }
}

async function getPortfolios(req, res) {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id }).sort({ createdAt: -1 });
    const response = [];
    for (const portfolio of portfolios) {
      response.push(await buildPortfolioSummary(portfolio));
    }
    return res.json({ success: true, message: 'Portfolios fetched', data: response });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch portfolios' });
  }
}

async function getPortfolioById(req, res) {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    return res.json({ success: true, message: 'Portfolio fetched', data: await buildPortfolioSummary(portfolio) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch portfolio' });
  }
}

async function updatePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const { name, description } = req.body;
    if (name) portfolio.name = name.trim();
    if (typeof description === 'string') portfolio.description = description.trim();
    await portfolio.save();
    return res.json({ success: true, message: 'Portfolio updated', data: portfolio });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update portfolio' });
  }
}

async function deletePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    return res.json({ success: true, message: 'Portfolio deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to delete portfolio' });
  }
}

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  buildPortfolioSummary,
};
