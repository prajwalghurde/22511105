import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

import StockChart from '../components/StockChart';
import TimeIntervalSelector from '../components/TimeIntervalSelector';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [minutes, setMinutes] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ticker = 'NVDA';

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks/${ticker}?minutes=${minutes}`);
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [minutes]);

  return (
    <>
      <Helmet>
        <title> NVDA Stock Chart | Stock Dashboard</title>
      </Helmet>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {ticker} Stock Price Chart
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TimeIntervalSelector minutes={minutes} setMinutes={setMinutes} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : (
          <StockChart data={stockData} />
        )}
      </Container>
    </>
  );
};

export default StockPage;
