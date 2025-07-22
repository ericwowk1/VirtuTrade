import React from 'react';
import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { MarketNews } from './MarketNews';

export function HomePage() {
  return (
    <div className="min-h-screen p-2 xl:p-4">
      <div className="mx-auto">
        <div className="grid grid-cols-11 grid-rows-[auto_1fr] gap-2 xl:gap-3 min-h-[calc(100vh-1rem)] xl:min-h-[calc(100vh-2rem)]">
          {/* Left Column - Market Summary and Top Movers <TopStockMovers /> <MarketSummary /> */}
          <div className="col-span-11 lg:col-span-2 lg:row-span-2 space-y-3 xl:space-y-4">
            
            <div className="bg-[#1E293B] rounded-lg">
              
            </div>
          </div>

          {/* Middle Column - Portfolio Chart */}
          <div className="col-span-11 lg:col-span-6 lg:row-span-1">
            <PortfolioPerformanceChart />
          </div>

          {/* Right Column - Position Overview */}
          <div className="col-span-11 lg:col-span-3 lg:row-span-1">
            <PositionOverview />
          </div>

          {/* Bottom Row - Market News <MarketNews /> */}
          <div className="col-span-11 lg:col-span-9">
            
          </div>
        </div>
      </div>
    </div>
  );
}