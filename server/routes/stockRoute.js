const express = require('express');
const {
  listStocks,
  findStocks,
  getStock,
  getStockHistory,
  analyzeStock,
} = require('../controllers/stockController');

const router = express.Router();

router.get('/', listStocks);
router.get('/search', findStocks);
router.get('/:symbol/history', getStockHistory);
router.get('/:symbol', getStock);
router.post('/:symbol/analyze', analyzeStock);

module.exports = router;
