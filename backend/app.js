const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stocks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', stockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
