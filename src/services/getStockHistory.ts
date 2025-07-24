import axios from 'axios';

type AlpacaBar = {
  c: number;
  h: number; 
  l: number; 
  n: number; 
  o: number; 
  t: string;
  v: number; 
  vw: number;
};

type AlpacaResponse = {
  bars: { [symbol: string]: AlpacaBar[] };
  next_page_token?: string;
};

export type ChartDataPoint = {
  time: number;
  value: number; // close price for area chart
};

export type TimeRange = '1D' | '1M' | '1Y' | 'ALL';

export async function getStockHistory(symbol: string, timeRange: TimeRange): Promise<ChartDataPoint[]> {
  const apiKey = process.env.ALPACA_API_KEY;
  const apiSecret = process.env.ALPACA_API_SECRET;
  
  const endDate = new Date();
  let startDate: Date;
  let timeframe: string;
  let limit: number;

  switch (timeRange) {
    case '1D':
      return await get1DayDataWithFallback(symbol, apiKey!, apiSecret!);
      
    case '1M':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      timeframe = '1H';  // Fixed: was '1Hour'
      limit = 1000;      // ~30 days * 24 hours = 720 max
      break;
      
    case '1Y':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      timeframe = '1D';  // Fixed: was '1Day'
      limit = 500;       // 365 trading days + buffer
      break;
      
    case 'ALL':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 10); // Increased from 5 to 10 years
      timeframe = '1W';  // Fixed: was '1Week'
      limit = 1000;      // ~10 years * 52 weeks = 520 max
      break;
      
    default:
      throw new Error('Invalid time range');
  }

  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  console.log(`Fetching ${symbol} for ${timeRange}:`);
  console.log(`- Start: ${startDateISO}`);
  console.log(`- End: ${endDateISO}`);
  console.log(`- Timeframe: ${timeframe}`);
  console.log(`- Limit: ${limit}`);

  try {
    const response = await axios.get<AlpacaResponse>(
      `https://data.alpaca.markets/v2/stocks/bars`,
      {
        params: {
          symbols: symbol.toUpperCase(),
          timeframe,
          start: startDateISO,
          end: endDateISO,
          limit,
          adjustment: 'raw',
          feed: 'iex',
          sort: 'asc'
        },
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': apiSecret,
        }
      }
    );

    const bars = response.data.bars[symbol.toUpperCase()];
    
    if (!bars || bars.length === 0) {
      console.log(`No bars returned for ${symbol}`);
      return [];
    }

    console.log(`Received ${bars.length} bars for ${timeRange}`);
    console.log(`First bar: ${bars[0].t} - $${bars[0].c}`);
    console.log(`Last bar: ${bars[bars.length - 1].t} - $${bars[bars.length - 1].c}`);

    return bars.map((bar: AlpacaBar): ChartDataPoint => ({
      time: Math.floor(new Date(bar.t).getTime() / 1000),
      value: bar.c
    }));

  } catch (error) {
    console.error('Error fetching from Alpaca:', error);
    if (axios.isAxiosError(error)) {
      console.error('Alpaca API response:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request params:', error.config?.params);
    }
    throw new Error('Failed to fetch stock data from Alpaca');
  }
}






async function get1DayDataWithFallback(symbol: string, apiKey: string, apiSecret: string): Promise<ChartDataPoint[]> {
  const maxDaysBack = 10; 
  
  for (let daysBack = 0; daysBack <= maxDaysBack; daysBack++) { // Start at today
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysBack);
    
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0); // Start of the day
    
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999); // End of the day
    
    const dayName = daysBack === 0 ? 'today' : `${daysBack} day${daysBack > 1 ? 's' : ''} ago`;
    console.log(`Trying to get 1D data for ${dayName}: ${targetDate.toDateString()}`);
    
    try {
      const response = await axios.get<AlpacaResponse>(
        `https://data.alpaca.markets/v2/stocks/bars`,
        {
          params: {
            symbols: symbol.toUpperCase(),
            timeframe: '5Min',
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            limit: 100,
            adjustment: 'raw',
            feed: 'iex',
            sort: 'asc'
          },
          headers: {
            'APCA-API-KEY-ID': apiKey,
            'APCA-API-SECRET-KEY': apiSecret,
          }
        }
      );

      const bars = response.data.bars[symbol.toUpperCase()];
      
      if (bars && bars.length > 0) {
        console.log(`Found ${bars.length} data points for ${dayName}`);
        return bars.map((bar: AlpacaBar): ChartDataPoint => ({
          time: Math.floor(new Date(bar.t).getTime() / 1000),
          value: bar.c
        }));
      } else {
        console.log(`No data found for ${dayName}, trying previous day...`);
      }

    } catch (error) {
      console.error(`Error fetching data for ${dayName}:`, error);
      // Continue to the next day instead of throwing
    }
  }
  
  console.log(`No data found after checking ${maxDaysBack + 1} days back`);
  return [];
}