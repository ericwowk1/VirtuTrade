import React from 'react';
import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { MarketNews } from './MarketNews';

export function HomePage() {
  return (
    <div className=" px-24 xl:px-58  to-slate-500">
      <div className="mx-auto">
        
        <div className="grid grid-cols-11 grid-rows-[auto_1fr] gap-6 ">
          {/* Top Row */}
          {/* Left Column - Market Summary and Top Movers */}
          <div className="col-span-2 row-span-2 flex flex-col gap-4">
            <MarketSummary />
            <div className="flex-1">
              <TopStockMovers />
            </div>
          </div>

          {/* Middle Column - Portfolio Chart */}
          <div className="col-span-11 lg:col-span-6 lg:row-span-1">
            <PortfolioPerformanceChart />
          </div>

          {/* Right Column - Position Overview */}
         <div className="col-span-11 lg:col-span-3 lg:col-start-9 lg:row-span-1">
            <PositionOverview />
          </div>

          {/* Bottom Row - Market News <MarketNews /> */}
          <div className="col-span-11 lg:col-span-9">
            <MarketNews />
            
          </div>
        </div>
      </div>
      </div>
      
   
  );
}