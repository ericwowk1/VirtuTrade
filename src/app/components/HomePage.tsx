import React from 'react';
import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { MarketNews } from './MarketNews';

export function HomePage() {
  return (
    <div className="min-h-screen py-2 xl:py-4 px-24 xl:px-64  to-slate-500">
      <div className="mx-auto">
        
        <div className="grid grid-cols-11 grid-rows-[auto_1fr] gap-3.5 min-h-screen">
          {/* Top Row */}
          {/* Left Column - Market Summary and Top Movers */}
          <div className="col-span-2 row-span-2 pr-3.5">
            <MarketSummary />
            <div className=" rounded-lg mt-5">
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
            
          </div>
        </div>
      </div>
      </div>
      
   
  );
}