

import React from 'react';
import { getStockData } from '@/services/getStockData';

interface StockData {
  c: number;  // current price
  pc: number; // previous close
  dp: number; // daily percent change
}

interface MarketDataItem {
  price: number | null;
  percent: string | null;
}

interface MarketData {
  [key: string]: MarketDataItem;
}

export async function MarketSummary() {
  // Fetch data on the server
  const fetchMarketData = async (): Promise<MarketData> => {
    const tickers = ['SPY', 'NDAQ', 'DIA'];
    const results: MarketData = {};
    
    for (const ticker of tickers) {
      try {
        const data = await getStockData(ticker) as StockData;
        const percent = data.dp.toFixed(2); // Use pre-calculated percent change
        results[ticker] = {
          price: data.c,
          percent: percent
        };
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error);
        results[ticker] = { price: null, percent: null };
      }
    }
    return results;
  };

  const marketData = await fetchMarketData();

  const formatPrice = (price: number | null): string => price ? `$${price.toFixed(2)}` : '--';
  
  const formatPercent = (percent: string | null): string => {
    if (!percent) return '--%';
    const sign = parseFloat(percent) >= 0 ? '+' : '';
    return `${sign}${percent}%`;
  };
  
  const getPercentColor = (percent: string | null): string => {
    if (!percent) return 'text-gray-400';
    return parseFloat(percent) >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="rounded-lg p-[1rem]  bg-slate-800/60 border border-slate-700 h-auto ">
      <div className="border-b-2 border-white w-full">
      <h2 className=" text-2xl text-white mb-4">Market Summary</h2>
      </div>
      <div className="space-y-3 pt-[1rem]">
        <div className="flex items-center  justify-between  p-[1rem] border-b-2  bg-[#0F172A] rounded-lg mb-4">
          <div>
            <div className="font-medium text-white ">S&P 500</div>
            <div className="text-sm text-gray-400">SPY</div>
          </div>
          <div className="">
            <div className="font-medium text-white">
              {formatPrice(marketData.SPY?.price)}
            </div>
            <div className={`text-right text-sm font-medium ${getPercentColor(marketData.SPY?.percent)}`}>
              {formatPercent(marketData.SPY?.percent)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between  bg-[#0F172A] border-b-2 border-[#0F172A] p-3 hover:bg-gray-750 transition-colors mb-4 rounded-lg">
          <div>
            <div className="font-medium text-white">NASDAQ</div>
            <div className="text-sm text-gray-400">NDAQ</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-white">
              {formatPrice(marketData.NDAQ?.price)}
            </div>
            <div className={`text-sm font-medium ${getPercentColor(marketData.NDAQ?.percent)}`}>
              {formatPercent(marketData.NDAQ?.percent)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between  bg-[#0F172A] border-b-2 border-[#0F172A] p-3 hover:bg-gray-750 transition-colors rounded-lg">
          <div>
            <div className="font-medium text-white">Dow Jones</div>
            <div className="text-sm text-gray-400">DIA</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-white">
              {formatPrice(marketData.DIA?.price)}
            </div>
            <div className={`text-sm font-medium ${getPercentColor(marketData.DIA?.percent)}`}>
              {formatPercent(marketData.DIA?.percent)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}