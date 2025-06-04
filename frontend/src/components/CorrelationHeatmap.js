import React from 'react';
import HeatMap from 'react-heatmap-grid';
import { Paper, Typography } from '@mui/material';

const CorrelationHeatmap = ({ data, tickers }) => {
  if (!data || data.length === 0) {
    return <Typography variant="body1">No data available.</Typography>;
  }

  // Prepare 2D matrix from API data
  const values = tickers.map(rowTicker =>
    tickers.map(colTicker => {
      const pair = data.find(
        d => (d.ticker1 === rowTicker && d.ticker2 === colTicker) ||
             (d.ticker1 === colTicker && d.ticker2 === rowTicker)
      );
      return pair ? pair.correlation.toFixed(2) : '-';
    })
  );

  return (
    <Paper sx={{ p: 2 }}>
      <HeatMap
        xLabels={tickers}
        yLabels={tickers}
        data={values}
        squares
        cellStyle={(background, value, min, max, data, x, y) => {
          const num = parseFloat(value);
          let bgColor = '#e0e0e0';
          if (!isNaN(num)) {
            if (num >= 0.7) bgColor = '#1565c0';
            else if (num >= 0.3) bgColor = '#64b5f6';
            else if (num <= -0.7) bgColor = '#c62828';
            else if (num <= -0.3) bgColor = '#ef5350';
          }
          return { background: bgColor, color: '#fff' };
        }}
        cellRender={value => value}
      />
      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        Strong positive (blue) to strong negative (red)
      </Typography>
    </Paper>
  );
};

export default CorrelationHeatmap;
