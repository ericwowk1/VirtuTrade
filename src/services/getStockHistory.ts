import axios from 'axios';

type RawStockData = {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

type ChartDataPoint = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export async function getStockHistory(symbol: string): Promise<ChartDataPoint[]> {

  console.log("symbol", symbol)
  const apikey =process.env.TWELVEDATA_API_KEY
  const rawData = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=${30}&apikey=${apikey}`);



  return rawData.data
}