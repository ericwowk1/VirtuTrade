import React from 'react';
import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';

export function HomePage() {
  const formatCurrency = (amount: number) => `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen p-6 ">
      
    
      {/* Main Content Grid */}
      <div className="grid xl:grid-cols-9 gap-9 ">
        
        {/* Left Column - Market Data */}
        <div className="xl:col-span-2  ">
          <MarketSummary />

            {/* Middle Column - Market Movers */}
        <div className="space-y-8 bg-[#1E293B] mt-4 rounded-lg">
          <TopStockMovers />
          
         
        </div>
          
          
        </div>

        {/*Portfolio summary - Middle Column */}
        <div className="xl:col-span-5 ">
          <PositionOverview />
        </div>

        {/* Right Column -  News */}
        <div className="space-y-8 xl:col-span-2">
       

          {/* AI Assistant */}
          <div className="bg-[#1E293B] rounded-lg ">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">FinanceAI</h3>
            </div>
            
            <div className="bg-[#1E293B] rounded-lg p-4 mb-4">
              <p className="text-gray-200">
                Your portfolio analysis will appear here once connected.
              </p>
            </div>

            <input
              type="text"
              placeholder="Ask me about your portfolio..."
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  );
}