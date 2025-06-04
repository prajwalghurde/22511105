import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

import CorrelationHeatmap from '../components/CorrelationHeatmap';
import TimeIntervalSelector from '../components/TimeIntervalSelector';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const CorrelationPage = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [minutes, setMinutes] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tickers = ['NVDA', 'PYPL', 'AAPL', 'MSFT'];

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = tickers.map(t => `ticker=${t}`).join('&');
        const response = await axios.get(`http://localhost:5000/api/stockcorrelation?minutes=${minutes}&${params}`);
        setHeatmapData(response.data);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
        setError('Failed to fetch correlation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [minutes]);

  return (
    <>
      <Helmet>
        <title> Correlation Heatmap | Stock Dashboard</title>
      </Helmet>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Stock Correlation Heatmap
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
          <CorrelationHeatmap data={heatmapData} tickers={tickers} />
        )}
      </Container>
    </>
  );
};

export default CorrelationPage;
