import React from 'react';
import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { MarketNews } from './MarketNews';

export function HomePage() {
  

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-11 grid-rows-[auto_1fr] gap-2 min-h-screen">
        {/* Top Row /}
        {/ Left Column - Market Summary and Top Movers */}
        <div className="col-span-2 row-span-2 pr-2">
          <MarketSummary />
          <div className="bg-[#1E293B] rounded-lg mt-4">
            <TopStockMovers />
          </div>
        </div>

        {/* Middle Column - Portfolio Chart */}
        <div className="col-span-6 row-span-1 ">
          <PortfolioPerformanceChart />
        </div>

        {/* Right Column - Position Overview */}
        <div className="col-span-3 row-span-1 pl-2">
          <PositionOverview />
        </div>

        {/* Bottom Row - Market News spanning middle + right columns */}
        <div className="col-span-9 pt-2">
          <MarketNews />
        </div>
      </div>
    </div>
  );
}