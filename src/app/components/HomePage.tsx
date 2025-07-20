import React from 'react';
import { MarketSummary } from './MarketSummary';
import { Leaderboard } from './Leaderboard';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';

export function HomePage() {
  const formatCurrency = (amount: number) => `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      
    {/* Portfolio Overview Header */}
<div className="bg-gray-900 rounded-lg  mb-8">
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-white mb-4">Users Dashboard</h1>
    <div className="flex items-baseline space-x-6">
      <div className="text-3xl font-bold text-white">$127,845.32</div>
      <div className="flex items-center space-x-2">
        <TrendingDown size={16} className="text-red-400" />
        <span className="font-semibold text-red-400">
          -$2,715.43 (-2.11%)
        </span>
        <span className="text-gray-400">Today</span>
      </div>
    </div>
  </div>
</div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Market Data */}
        <div className="">
          <MarketSummary />

            {/* Middle Column - Market Movers */}
        <div className="space-y-8">
          <TopStockMovers />
          
         
        </div>
          
          
        </div>

        {/*Portfolio summary */}
        <PositionOverview />

        {/* Right Column - Leaderboard & News */}
        <div className="space-y-8">
          <Leaderboard />

          {/* AI Assistant */}
          <div className="bg-gray-900 rounded-lg ">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">FinanceAI</h3>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-gray-200">
                Your portfolio analysis will appear here once connected.
              </p>
            </div>

            <input
              type="text"
              placeholder="Ask me about your portfolio..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  );
}