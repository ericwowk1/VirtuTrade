'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Mover {
  symbol: string;
  percent_change: number;
  change: number;
  price: number;
}

interface MoversResponse {
  gainers: Mover[];
  losers: Mover[];
  market_type: string;
  last_updated: string;
}

export function TopStockMovers() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [movers, setMovers] = useState<MoversResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const response = await fetch('/api/stock-movers');
        if (!response.ok) {
          throw new Error('Failed to fetch movers');
        }
        const data = await response.json();
        setMovers(data);
      } catch (err) {
        console.error('Error fetching movers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;
  const formatChange = (change: number) => `$${Math.abs(change).toFixed(2)}`;

  if (loading) {
    return (
      <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
        
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-slate-700 rounded w-48"></div>
            <div className="h-4 bg-slate-700 rounded w-32"></div>
          </div>
          <div className="h-10 bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-12 bg-slate-700 rounded"></div>
            ))}
          </div>
        
      </div>
    );
  }

  if (error || !movers) {
    return (
      <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
        <div className="text-red-400">Failed to load market movers</div>
      </div>
    );
  }

  const topGainers = movers.gainers.slice(0, 4);
  const topLosers = movers.losers.slice(0, 4);
  const currentData = activeTab === 'gainers' ? topGainers : topLosers;

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 h-[30rem]">
      <div className="flex items-center justify-between mb-4">
        <div className="border-b-2 border-white w-full">
        <h3 className="text-xl text-white mb-4">Top Market Movers</h3>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#0F172A] rounded-lg p-1 mt-[1rem]">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center space-x-2 px-3 py-2  rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
            activeTab === 'gainers'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Top Gainers</span>
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
            activeTab === 'losers'
              ? 'bg-red-600 text-white'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4 " />
          <span>Top Losers</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 ">
        {currentData.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between mt-2 py-2 hover:bg-slate-700/30 rounded-lg px-2 transition-colors duration-200 bg-[#0F172A]">
            <div className="flex items-center space-x-3 ">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeTab === 'gainers' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                #{index + 1}
              </div>
              <div>
                <div className="text-white font-medium">{stock.symbol}</div>
                <div className="text-slate-400 text-sm">{formatPrice(stock.price)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${activeTab === 'gainers' ? 'text-emerald-400' : 'text-red-400'}`}>
                {activeTab === 'gainers' ? '+' : ''}{formatPercent(stock.percent_change)}
              </div>
              <div className={`text-sm ${activeTab === 'gainers' ? 'text-emerald-400' : 'text-red-400'}`}>
                {activeTab === 'gainers' ? '+' : '-'}{formatChange(stock.change)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}