import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Typography, Paper } from '@mui/material';

const StockChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography variant="body1">No data available.</Typography>;
  }

  const averagePrice =
    data.reduce((acc, point) => acc + point.price, 0) / data.length;

  return (
    <Paper sx={{ p: 2 }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={averagePrice} label="Avg" stroke="red" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="price" stroke="#1976d2" activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StockChart;
