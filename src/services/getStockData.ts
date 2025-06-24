// Alpaca API client for stock data
console.log("getstockdata ran")
let count = 0;

// Alpaca API configuration
const ALPACA_API_KEY = process.env.ALPACA_API_KEY || 'PKPPH5FGUYU9Y8DCRVPE';
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY || 'FBgnsApmxJCJhE1h0slsphiCimihRPxMyXFBynrt';
const ALPACA_BASE_URL = 'https://data.alpaca.markets/v2';

// Helper function to make authenticated requests to Alpaca
async function makeAlpacaRequest(endpoint: string): Promise<any> {
  const response = await fetch(`${ALPACA_BASE_URL}${endpoint}`, {
    headers: {
      'APCA-API-KEY-ID': ALPACA_API_KEY,
      'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
      'accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getStockData(ticker: string) {
  console.log('Fetching data for ticker:', ticker);
  count = count + 1;
  console.log("count", count)
  
  try {
    const data = await makeAlpacaRequest(`/stocks/snapshots?symbols=${ticker}`);
    
    if (!data[ticker]) {
      throw new Error(`No data found for ticker: ${ticker}`);
    }

    const snapshot = data[ticker];
    const currentPrice = snapshot.latestTrade?.p || snapshot.latestQuote?.ap || 0;
    const previousClose = snapshot.prevDailyBar?.c || currentPrice;

    // Transform Alpaca response to match expected StockData interface
    const stockData = {
      c: currentPrice, // current price
      pc: previousClose, // previous close
      d: currentPrice - previousClose, // change amount
      // Calculate percent change: ((Current Price - Previous Close) / Previous Close) * 100
      dp: previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0
    };

    console.log("Stock Data", stockData);
    return stockData;
  } catch (error) {
    console.error("Alpaca API Error:", error);
    throw error;
  }
}

