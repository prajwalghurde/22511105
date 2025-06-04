const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockBySymbol,
  getAveragePrice,
  getCorrelation
} = require('../controllers/stocks');

router.get('/average', getAveragePrice); // Place above symbol to avoid conflict
router.get('/correlation', getCorrelation);
router.get('/:symbol', getStockBySymbol);
router.get('/', getAllStocks);

module.exports = router;
