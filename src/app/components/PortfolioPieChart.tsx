'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  percentage: number;
}

interface PortfolioStats {
  totalValue: number;
  totalGainLoss: number;
  buyingPower: number;
}

// Professional color palette with 24 colors
const COLORS = [
  '#1e3a8a', // Deep blue
  '#059669', // Emerald green
  '#dc2626', // Red
  '#7c2d12', // Brown
  '#4338ca', // Indigo
  '#be185d', // Pink
  '#0891b2', // Cyan
  '#65a30d', // Lime
  '#c2410c', // Orange
  '#7c3aed', // Violet
  '#0d9488', // Teal
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#e11d48', // Rose
  '#0284c7', // Sky blue
  '#16a34a', // Green
  '#ea580c', // Orange red
  '#8b5cf6', // Light purple
  '#0f766e', // Dark teal
  '#facc15', // Amber
  '#374151', // Dark gray
  '#6366f1', // Slate blue
  '#ef4444', // Bright red
  '#6b7280', // Medium gray for cash
];

const STARTING_AMOUNT = 100000;



// Enhanced portfolio stats component
function PortfolioStatsRow({ stats }: { stats: PortfolioStats }) {
  const isGain = stats.totalGainLoss >= 0;
  const percentageChange = ((stats.totalGainLoss / STARTING_AMOUNT) * 100);
  
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* Total Value */}
      <div className="bg-gradient-to-br bg-slate-800 to-gray-900 rounded-xl p-6 text-center shadow-lg border border-gray-600">
        <div className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Total Value</div>
        <div className="text-sm lg:text-2xl font-bold text-white mb-1">
          ${stats.totalValue.toLocaleString()}
        </div>
        
      </div>

      {/* Total Gain/Loss */}
      <div className="bg-gradient-to-br bg-slate-800 to-gray-900 rounded-xl p-6 text-center shadow-lg border border-gray-600">
        <div className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Total Gain/Loss</div>
        <div className={`text-sm lg:text-2xl  font-bold mb-1 ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
          {isGain ? '+' : ''}${stats.totalGainLoss.toLocaleString()}
        </div>
        <div className={`text-xs font-medium ${isGain ? 'text-emerald-300' : 'text-red-300'}`}>
          {isGain ? '+' : ''}{percentageChange.toFixed(2)}%
        </div>
      </div>

      {/* Buying Power */}
      <div className="bg-gradient-to-br bg-slate-800 to-gray-900 rounded-xl p-6 text-center shadow-lg border border-gray-600">
        <div className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Buying Power</div>
        <div className="text-sm lg:text-2xl  font-bold text-white mb-1">
          ${stats.buyingPower.toLocaleString()}
        </div>
       
      </div>
    </div>
  );
}

export function PortfolioPieChart() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalGainLoss: 0,
    buyingPower: 0
  });
  const [chartData, setChartData] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

useEffect(() => {
  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/Piechart');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      const data = await response.json();
      const fetchedPositions = data.positions || [];
      
    
      const totalCurrentValue = fetchedPositions.reduce((sum: number, pos: Position) => sum + pos.currentValue, 0);
      
    
      const investedPositions = fetchedPositions.filter((pos: Position) => pos.symbol !== 'CASH');
      const totalInvestedValue = investedPositions.reduce((sum: number, pos: Position) => sum + pos.currentValue, 0);
      
      
      const cashPosition = fetchedPositions.find((pos: Position) => pos.symbol === 'CASH');
      const buyingPower = cashPosition ? cashPosition.currentValue : 0;
      
      const totalValue = totalCurrentValue;
      
     
      const totalGainLoss = totalValue - STARTING_AMOUNT;
      
    
      const chartPositions = investedPositions.map((pos: Position) => ({
        ...pos,
        percentage: (pos.currentValue / totalValue) * 100
      }));
      
 
      if (buyingPower > 0) {
        const buyingPowerPosition: Position = {
          symbol: 'CASH',
          quantity: 1,
          averagePrice: buyingPower,
          currentValue: buyingPower,
          percentage: (buyingPower / totalValue) * 100
        };
        chartPositions.push(buyingPowerPosition);
      }
      
      setPositions(investedPositions);
      setChartData(chartPositions);
      setPortfolioStats({
        totalValue,
        totalGainLoss,
        buyingPower
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  fetchPositions();
}, []);

  if (loading) {
    return (
      <div className='flex flex-col'>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 text-center shadow-lg border border-gray-600">
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse mb-3 mx-auto"></div>
              <div className="h-8 w-32 bg-gray-600 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-3 w-20 bg-gray-600 rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-800 rounded-xl p-8 text-white shadow-xl border border-gray-700">
          <div className="flex items-center mb-8">
            <h3 className="text-4xl font-bold tracking-wide">Portfolio Breakdown</h3>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="flex-shrink-0 space-y-4 min-w-[280px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center p-3 rounded-lg bg-gray-800/50">
                  <div className="w-4 h-4 rounded-full mr-4 bg-gray-600 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-20 bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="w-[450px] h-[450px] rounded-full border-4 border-gray-600 animate-pulse bg-gray-800/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">Loading...</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Total Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col'>
        <div className="bg-gradient-to-br bg-slate-800 to-gray-900 rounded-xl p-8 text-white shadow-xl border border-gray-700">
          <div className="flex items-center mb-8">
            <h3 className="text-3xl font-bold tracking-wide">Portfolio Breakdown</h3>
          </div>
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <p className="text-red-400 mb-6 text-lg">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

 return (
    <div className='flex flex-col'>
      <PortfolioStatsRow stats={portfolioStats} />
      <div className="bg-gradient-to-br bg-slate-800 to-gray-900 rounded-xl p-4 md:p-6 lg:p-8 text-white shadow-xl border border-gray-700">
        <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold tracking-wide">Portfolio Breakdown</h3>
        </div>
        
        {/* Mobile-first layout */}
        <div className="flex flex-col space-y-6">
          {/* Chart - Shows first on mobile */}
          <div className="w-full order-2 lg:order-1">
            <div className="relative w-full mx-auto" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={1}
                    dataKey="currentValue"
                    stroke="#374151"
                    strokeWidth={2}
                    label={({ symbol, percentage }) => {
                      if (percentage < 5) return '';
                      return symbol === 'CASH' ? 'CASH' : symbol;
                    }}
                    labelLine={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend - Shows second on mobile */}
          <div className="w-full order-1 lg:order-2">
            <div className="space-y-2 md:space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {chartData.map((position, index) => (
                <div 
                  key={position.symbol} 
                  className={`flex items-center p-3 md:p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    hoveredIndex === index 
                      ? 'bg-gray-700/70 transform scale-105 shadow-lg' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-3 md:mr-4 shadow-md border-2 border-gray-600 flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-base md:text-lg font-semibold tracking-wide mb-1 truncate">
                      {position.symbol === 'CASH' ? 'Cash Available' : position.symbol}
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 font-medium">
                      {position.percentage.toFixed(1)}% • ${position.currentValue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop layout - side by side */}
        <style jsx>{`
          @media (min-width: 1024px) {
            .flex.flex-col.space-y-6 {
              display: flex;
              flex-direction: row;
              gap: 3rem;
              align-items: flex-start;
            }
            .flex.flex-col.space-y-6 > div:first-child {
              flex: 1;
            }
            .flex.flex-col.space-y-6 > div:last-child {
              flex-shrink: 0;
              min-width: 300px;
              max-width: 350px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}