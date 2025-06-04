const axios = require('axios');

const EXCHANGE1_URL = 'http://20.204.156.144/evaluation-service';
const EXCHANGE2_URL = 'http://20.204.156.144/evaluation-service';

async function getAllStocks(req, res) {
  try {
    const [res1, res2] = await Promise.all([
      axios.get(`${EXCHANGE1_URL}/stocks`),
      axios.get(`${EXCHANGE2_URL}/stocks`)
    ]);

    const combinedStocks = [...res1.data.stocks, ...res2.data.stocks];
    const uniqueStocks = Array.from(new Map(combinedStocks.map(stock => [stock.ticker, stock])).values());

    res.json({ stocks: uniqueStocks });
  } catch (error) {
    console.error("Error fetching stocks:", error.message);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
}

async function getStockBySymbol(req, res) {
  try {
    const { symbol } = req.params;
    const [res1, res2] = await Promise.all([
      axios.get(`${EXCHANGE1_URL}/stocks/${symbol}`),
      axios.get(`${EXCHANGE2_URL}/stocks/${symbol}`)
    ]);

    const prices = [];
    if (res1.data && res1.data.price) prices.push(res1.data.price);
    if (res2.data && res2.data.price) prices.push(res2.data.price);

    if (prices.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    res.json({
      symbol,
      price: averagePrice,
      prices: prices
    });
  } catch (error) {
    console.error("Error fetching stock:", error.message);
    res.status(500).json({ error: "Failed to fetch stock details" });
  }
}

// Calculate average price for a time window
async function getAveragePrice(req, res) {
  try {
    const { symbol, window } = req.query;
    if (!symbol || !window) {
      return res.status(400).json({ error: "Symbol and window parameters are required" });
    }

    const [res1, res2] = await Promise.all([
      axios.get(`${EXCHANGE1_URL}/stocks/${symbol}/history?window=${window}`),
      axios.get(`${EXCHANGE2_URL}/stocks/${symbol}/history?window=${window}`)
    ]);

    const prices1 = res1.data?.prices || [];
    const prices2 = res2.data?.prices || [];
    const allPrices = [...prices1, ...prices2];

    if (allPrices.length === 0) {
      return res.status(404).json({ error: "No price data found" });
    }

    const averagePrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

    res.json({
      symbol,
      average: averagePrice
    });
  } catch (error) {
    console.error("Error calculating average price:", error.message);
    res.status(500).json({ error: "Failed to calculate average price" });
  }
}

// Calculate correlation between two stocks
async function getCorrelation(req, res) {
  try {
    const { symbol1, symbol2, window } = req.query;
    if (!symbol1 || !symbol2 || !window) {
      return res.status(400).json({ error: "Both symbols and window parameters are required" });
    }

    const [hist1_1, hist1_2, hist2_1, hist2_2] = await Promise.all([
      axios.get(`${EXCHANGE1_URL}/stocks/${symbol1}/history?window=${window}`),
      axios.get(`${EXCHANGE1_URL}/stocks/${symbol2}/history?window=${window}`),
      axios.get(`${EXCHANGE2_URL}/stocks/${symbol1}/history?window=${window}`),
      axios.get(`${EXCHANGE2_URL}/stocks/${symbol2}/history?window=${window}`)
    ]);

    const prices1 = [...(hist1_1.data?.prices || []), ...(hist2_1.data?.prices || [])];
    const prices2 = [...(hist1_2.data?.prices || []), ...(hist2_2.data?.prices || [])];

    if (prices1.length === 0 || prices2.length === 0) {
      return res.status(404).json({ error: "Insufficient price data for correlation" });
    }

    const n = Math.min(prices1.length, prices2.length);
    const x = prices1.slice(0, n);
    const y = prices2.slice(0, n);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const correlation = (n * sumXY - sumX * sumY) / 
      (Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)));

    res.json({
      symbol1,
      symbol2,
      correlation: correlation
    });
  } catch (error) {
    console.error("Error calculating correlation:", error.message);
    res.status(500).json({ error: "Failed to calculate correlation" });
  }
}

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getAveragePrice,
  getCorrelation
};
