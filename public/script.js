async function updateStockPrices() {
    try {
        const response = await fetch('/api/stocks');
        const stockData = await response.json();

        stockData.forEach(stock => {
            const priceElement = document.getElementById(`${stock.symbol}-price`);
            if (stock.error) {
                priceElement.innerText = stock.error;
            } else {
                priceElement.innerText = `Price: $${stock.price.toFixed(2)}`;
            }
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

// Initial call to fetch stock prices when the page loads
updateStockPrices();

// Refresh stock prices every 5 minute (300000 ms)
setInterval(updateStockPrices, 300000);

