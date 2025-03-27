const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Temporary mock routes for development
app.get('/api/coins', (req, res) => {
  res.json([
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      current_price: 50000,
      price_change_percentage_24h: 2.5,
      market_cap: 1000000000000
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      current_price: 3000,
      price_change_percentage_24h: 1.8,
      market_cap: 500000000000
    }
  ]);
});

app.get('/api/news', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Bitcoin Reaches New High',
      description: 'Bitcoin has reached a new all-time high...',
      source: 'Crypto News',
      published_at: new Date().toISOString()
    }
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 