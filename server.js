require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '9H37C4A4WAJYHD4E';

app.use(express.static(path.join(__dirname, 'public')));

const stocks = ['GOOGL', 'AAPL', 'AMZN', 'MSFT', 'NVDA', 'TSLA'];

async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    try {
        const response = await axios.get(url);
        const data = response.data['Global Quote'];

        if (data && data['05. price']) {
            return {
                symbol,
                price: parseFloat(data['05. price']),
                timestamp: new Date().toISOString()
            };
        } else {
            return { symbol, error: 'Error fetching data or data not available.' };
        }
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return { symbol, error: 'Server error fetching stock data.' };
    }
}

app.get('/api/stocks', async (req, res) => {
    const stockData = await Promise.all(stocks.map(fetchStockData));
    res.json(stockData);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
