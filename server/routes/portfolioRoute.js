const express = require('express');
const {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', createPortfolio);
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

module.exports = router;
