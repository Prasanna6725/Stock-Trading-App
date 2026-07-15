const Stock = require('../models/stockSchema');
const Order = require('../models/orderSchema');
const Transaction = require('../models/transactionModel');
const Portfolio = require('../models/portfolioModel');
const User = require('../models/userModel');
const {
  getAllStocks,
  searchStocks,
  getStockBySymbol,
  analyzeStrategy,
} = require('../services/stockService');

async function listStocks(req, res) {
  try {
    const stocks = await getAllStocks();
    return res.json({ success: true, message: 'Stocks fetched', data: stocks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch stocks' });
  }
}

async function findStocks(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    const stocks = await searchStocks(query);
    return res.json({ success: true, message: 'Stocks searched', data: stocks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to search stocks' });
  }
}

async function getStock(req, res) {
  try {
    const stock = await getStockBySymbol(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    return res.json({ success: true, message: 'Stock fetched', data: stock });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch stock' });
  }
}

async function getStockHistory(req, res) {
  try {
    const stock = await getStockBySymbol(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    return res.json({
      success: true,
      message: 'History fetched',
      data: {
        symbol: stock.symbol,
        name: stock.name,
        historicalData: stock.historicalData || [],
        source: stock.source,
        marketStatus: stock.marketStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch history' });
  }
}

async function analyzeStock(req, res) {
  try {
    const stock = await getStockBySymbol(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    const { shortWindow = 5, longWindow = 20 } = req.body || {};
    const analysis = analyzeStrategy(stock.historicalData || [], Number(shortWindow), Number(longWindow));
    return res.json({ success: true, message: 'Strategy analysis complete', data: analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to analyze strategy' });
  }
}

async function buyStock(req, res) {
  const session = await Stock.db.startSession();
  try {
    const { symbol, quantity, portfolioId } = req.body;
    if (!symbol || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid symbol and quantity are required' });
    }

    const stock = await getStockBySymbol(symbol);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const portfolio = await Portfolio.findOne({ _id: portfolioId, user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const price = Number(stock.price.toFixed(2));
    const totalAmount = Number((price * Number(quantity)).toFixed(2));
    if (user.balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient virtual balance' });
    }

    let createdTransaction;
    let createdOrder;
    let updatedPortfolio;
    let updatedUser;

    await session.withTransaction(async () => {
      const holdingIndex = portfolio.holdings.findIndex((holding) => holding.symbol === stock.symbol);
      if (holdingIndex >= 0) {
        const holding = portfolio.holdings[holdingIndex];
        const oldQuantity = holding.quantity;
        const oldAverageBuyPrice = holding.averageBuyPrice;
        const newQuantity = oldQuantity + Number(quantity);
        const newAverageBuyPrice = ((oldQuantity * oldAverageBuyPrice) + (Number(quantity) * price)) / newQuantity;
        portfolio.holdings[holdingIndex] = {
          ...holding,
          stock: stock._id,
          quantity: newQuantity,
          averageBuyPrice: Number(newAverageBuyPrice.toFixed(2)),
        };
      } else {
        portfolio.holdings.push({
          stock: stock._id,
          symbol: stock.symbol,
          quantity: Number(quantity),
          averageBuyPrice: price,
        });
      }

      user.balance = Number((user.balance - totalAmount).toFixed(2));
      updatedUser = await user.save({ session });
      updatedPortfolio = await portfolio.save({ session });

      createdTransaction = await Transaction.create([
        {
          user: user._id,
          stock: stock._id,
          portfolio: portfolio._id,
          symbol: stock.symbol,
          type: 'BUY',
          quantity: Number(quantity),
          price,
          amount: totalAmount,
          paymentMode: 'VIRTUAL_BALANCE',
        },
      ], { session });

      createdOrder = await Order.create([
        {
          user: user._id,
          stock: stock._id,
          portfolio: portfolio._id,
          symbol: stock.symbol,
          quantity: Number(quantity),
          price,
          totalAmount,
          orderType: 'BUY',
          status: 'COMPLETED',
          executedAt: new Date(),
        },
      ], { session });
    });

    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'Buy order completed',
      data: {
        user: {
          balance: updatedUser.balance,
        },
        portfolio: updatedPortfolio,
        transaction: createdTransaction[0],
        order: createdOrder[0],
      },
    });
  } catch (error) {
    session.endSession();
    return res.status(500).json({ success: false, message: error.message || 'Buy operation failed' });
  }
}

async function sellStock(req, res) {
  const session = await Stock.db.startSession();
  try {
    const { symbol, quantity, portfolioId } = req.body;
    if (!symbol || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid symbol and quantity are required' });
    }

    const stock = await getStockBySymbol(symbol);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const portfolio = await Portfolio.findOne({ _id: portfolioId, user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const holdingIndex = portfolio.holdings.findIndex((holding) => holding.symbol === stock.symbol);
    if (holdingIndex < 0) {
      return res.status(400).json({ success: false, message: 'You do not own this stock in the selected portfolio' });
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < Number(quantity)) {
      return res.status(400).json({ success: false, message: 'Insufficient stock quantity to sell' });
    }

    const price = Number(stock.price.toFixed(2));
    const totalAmount = Number((price * Number(quantity)).toFixed(2));

    let updatedPortfolio;
    let updatedUser;
    let createdTransaction;
    let createdOrder;

    await session.withTransaction(async () => {
      const remainingQuantity = holding.quantity - Number(quantity);
      if (remainingQuantity === 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      } else {
        portfolio.holdings[holdingIndex] = {
          ...holding,
          quantity: remainingQuantity,
        };
      }

      user.balance = Number((user.balance + totalAmount).toFixed(2));
      updatedUser = await user.save({ session });
      updatedPortfolio = await portfolio.save({ session });

      createdTransaction = await Transaction.create([
        {
          user: user._id,
          stock: stock._id,
          portfolio: portfolio._id,
          symbol: stock.symbol,
          type: 'SELL',
          quantity: Number(quantity),
          price,
          amount: totalAmount,
          paymentMode: 'VIRTUAL_BALANCE',
        },
      ], { session });

      createdOrder = await Order.create([
        {
          user: user._id,
          stock: stock._id,
          portfolio: portfolio._id,
          symbol: stock.symbol,
          quantity: Number(quantity),
          price,
          totalAmount,
          orderType: 'SELL',
          status: 'COMPLETED',
          executedAt: new Date(),
        },
      ], { session });
    });

    session.endSession();

    return res.json({
      success: true,
      message: 'Sell order completed',
      data: {
        user: {
          balance: updatedUser.balance,
        },
        portfolio: updatedPortfolio,
        transaction: createdTransaction[0],
        order: createdOrder[0],
      },
    });
  } catch (error) {
    session.endSession();
    return res.status(500).json({ success: false, message: error.message || 'Sell operation failed' });
  }
}

async function transactionHistory(req, res) {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('portfolio', 'name')
      .populate('stock', 'symbol name price');

    return res.json({ success: true, message: 'Transaction history fetched', data: transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch transaction history' });
  }
}

async function allTransactions(req, res) {
  try {
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username email role')
      .populate('portfolio', 'name')
      .populate('stock', 'symbol name price');
    return res.json({ success: true, message: 'All transactions fetched', data: transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch transactions' });
  }
}

module.exports = {
  listStocks,
  findStocks,
  getStock,
  getStockHistory,
  analyzeStock,
  buyStock,
  sellStock,
  transactionHistory,
  allTransactions,
};
