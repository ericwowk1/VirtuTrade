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

export async function getStockData(tickers: string | string[]) {
  // Convert single ticker to array for uniform handling
  const tickerArray = Array.isArray(tickers) ? tickers : [tickers];
  const tickerString = tickerArray.join(',');
  
 
  
  try {
    
    const data = await makeAlpacaRequest(`/stocks/snapshots?symbols=${tickerString}`);
    
    // If single ticker was passed, return single result
    if (!Array.isArray(tickers)) {
      const ticker = tickers;
      if (!data[ticker]) {
        throw new Error(`No data found for ticker: ${ticker}`);
      }
      
      const snapshot = data[ticker];
      const currentPrice = snapshot.latestTrade?.p || snapshot.latestQuote?.ap || 0;
      const previousClose = snapshot.prevDailyBar?.c || currentPrice;
      
      return {
        c: currentPrice,
        pc: previousClose,
        d: currentPrice - previousClose,
        dp: previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0
      };
    }
    
    // For multiple tickers, return an object with ticker symbols as keys
    const results: Record<string, any> = {};
    
    for (const ticker of tickerArray) {
      if (!data[ticker]) {
        console.warn(`No data found for ticker: ${ticker}`);
        continue;
      }
      
      const snapshot = data[ticker];
      const currentPrice = snapshot.latestTrade?.p || snapshot.latestQuote?.ap || 0;
      const previousClose = snapshot.prevDailyBar?.c || currentPrice;
      
      results[ticker] = {
        c: currentPrice,
        pc: previousClose,
        d: currentPrice - previousClose,
        dp: previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0
      };
    }
    
    return results;
  } catch (error) {
    console.error("Alpaca API Error:", error);
    throw error;
  }
}