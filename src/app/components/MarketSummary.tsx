import React from 'react';
import { getStockData } from '@/services/getStockData';

export async function MarketSummary() {
  // Fetch data on the server
  const fetchMarketData = async () => {
    const tickers = ['SPY', 'NDAQ', 'DIA'];
    const results = {};
    
    for (const ticker of tickers) {
      try {
        const data = await getStockData(ticker);
        const percent = ((data.c - data.pc) / data.pc * 100).toFixed(2);
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

  const formatPrice = (price) => price ? price.toFixed(2) : '--';
  const formatPercent = (percent) => {
    if (!percent) return '--%';
    const sign = parseFloat(percent) >= 0 ? '+' : '';
    return `${sign}${percent}%`;
  };
  const getPercentColor = (percent) => {
    if (!percent) return 'text-white/60';
    return parseFloat(percent) >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        📈 Market Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10">
          <span className="font-medium text-white">S&P 500 (SPY)</span>
          <div className="text-right">
            <div className="font-semibold text-white">
              ${formatPrice(marketData.SPY?.price)}
            </div>
            <div className={`text-sm ${getPercentColor(marketData.SPY?.percent)}`}>
              {formatPercent(marketData.SPY?.percent)}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10">
          <span className="font-medium text-white">NASDAQ Inc</span>
          <div className="text-right">
            <div className="font-semibold text-white">
              ${formatPrice(marketData.NDAQ?.price)}
            </div>
            <div className={`text-sm ${getPercentColor(marketData.NDAQ?.percent)}`}>
              {formatPercent(marketData.NDAQ?.percent)}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10">
          <span className="font-medium text-white">Dow Jones (DIA)</span>
          <div className="text-right">
            <div className="font-semibold text-white">
              ${formatPrice(marketData.DIA?.price)}
            </div>
            <div className={`text-sm ${getPercentColor(marketData.DIA?.percent)}`}>
              {formatPercent(marketData.DIA?.percent)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}