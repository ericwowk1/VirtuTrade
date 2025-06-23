import React from 'react';
import { MarketSummary } from './MarketSummary';
import { Leaderboard } from './Leaderboard';
import { Brain, TrendingDown } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      
      {/* Clean Portfolio Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white shadow-lg mb-8 px-12 py-10">
        <h2 className="text-2xl font-medium mb-2">Mike's Portfolio</h2>
        <h1 className="text-5xl font-bold mb-4">$127,845.32</h1>
        <div className="flex items-center space-x-2 text-lg">
          <TrendingDown size={20} className="text-red-300" />
          <span className="text-red-300 font-semibold">-2.11%</span>
          <span className="text-blue-200">All-Time</span>
        </div>
      </div>

      {/* Simple 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          <MarketSummary />

          {/* Simple AI Assistant */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">FinanceAI</h3>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <p className="text-slate-200">
                Based on your portfolio, consider diversifying into tech stocks. 
                NVDA and TSLA show strong growth potential.
              </p>
            </div>

            <input
              type="text"
              placeholder="Ask me anything about your portfolio..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <Leaderboard />

          {/* Clean News Section */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Market News</h3>
            
            <div className="space-y-4">
              {[
                "Fed signals potential rate cuts amid inflation concerns",
                "Tech stocks rally on strong earnings reports", 
                "Oil prices surge following OPEC+ production cuts"
              ].map((headline, index) => (
                <div key={index} className="py-3 border-b border-slate-700 last:border-b-0">
                  <h4 className="text-slate-200 font-medium mb-1">{headline}</h4>
                  <p className="text-slate-400 text-sm">{2 + index * 13} minutes ago</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}