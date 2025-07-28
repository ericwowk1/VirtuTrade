import { MarketSummary } from './MarketSummary';
import { PositionOverview } from './PositionOverview';
import { Brain, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { TopStockMovers } from './TopStockMovers';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { MarketNews } from './MarketNews';

export function HomePage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12 py-4 sm:py-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Mobile Layout (default) */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
         
          {/* Position Overview */}
          <PositionOverview />

          {/* Portfolio Performance Chart */}
          <PortfolioPerformanceChart />

           {/* Market Summary - Full width on mobile */}
          <MarketSummary />
          
          {/* Top Stock Movers */}
          <TopStockMovers />
          
          {/* Market News */}
          <MarketNews />
        </div>

        {/* Desktop Layout - Hidden on mobile, shown on lg and up */}
        <div className="hidden lg:grid lg:grid-cols-12 xl:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-4 xl:gap-6">
          {/* Left Column - Market Summary and Top Movers */}
          <div className="lg:col-span-3 xl:col-span-3 lg:row-span-3 flex flex-col gap-4 xl:gap-6">
            <MarketSummary />
            <div className="flex-1">
              <TopStockMovers />
            </div>
          </div>

          {/* Middle Column - Portfolio Chart */}
          <div className="lg:col-span-6 xl:col-span-6 lg:col-start-4 xl:col-start-4 lg:row-span-1">
            <PortfolioPerformanceChart />
          </div>

          {/* Middle Column - Position Overview */}
          <div className="lg:col-span-6 xl:col-span-6 lg:col-start-4 xl:col-start-4 lg:row-span-1">
            <PositionOverview />
          </div>

          {/* Right Column - Market News */}
          <div className="lg:col-span-3 xl:col-span-3 lg:col-start-10 xl:col-start-10 lg:row-start-1 lg:row-span-3">
            <MarketNews />
          </div>
        </div>
      </div>
    </div>
  );
}