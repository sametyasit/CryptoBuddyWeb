const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// CoinGecko API URL
const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

// Get top coins by market cap
router.get('/top', async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h,7d'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top coins:', error.message);
    res.status(500).json({ message: 'Error fetching top coins', error: error.message });
  }
});

// Get detailed coin data
router.get('/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: true,
        developer_data: true,
        sparkline: true
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching coin details for ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Error fetching coin details', error: error.message });
  }
});

// Search coins
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${COINGECKO_API_URL}/search`, {
      params: { query }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error searching coins:', error.message);
    res.status(500).json({ message: 'Error searching coins', error: error.message });
  }
});

// Get coin price history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.query;
    
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days || 7,
        interval: days > 30 ? 'daily' : 'hourly'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching price history for ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Error fetching price history', error: error.message });
  }
});

// Get global market data
router.get('/global', async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching global market data:', error.message);
    res.status(500).json({ message: 'Error fetching global market data', error: error.message });
  }
});

module.exports = router; 