'use client';

import { useState, useEffect } from 'react';

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  historicalPrices: number[];
  currentPrice: number;
  change: number;
  changePercent: number;
  logo: string | null;
  name: string;
}

const SimpleSparkline = ({ data, color, width = 60, height = 24 }: { data: number[]; color: string; width?: number; height?: number; }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  const fillPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={fillPoints} fill={color} fillOpacity="0.2" stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const CompanyLogo = ({ symbol, logo, name }: { symbol: string; logo: string | null; name: string }) => {
  const [imgError, setImgError] = useState(false);
  if (!logo || imgError) {
    return (
      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
        {symbol.slice(0, 2)}
      </div>
    );
  }
  return <img src={logo} alt={`${name} logo`} className="w-6 h-6 rounded-full object-contain bg-white" onError={() => setImgError(true)} loading="lazy" />;
};

export function PositionOverview() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/positions');
        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }
        const data = await response.json();
        setPositions(data.stocks || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1E293B] rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-6">Positions Overview</h3>
        {/* Skeleton UI */}
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Positions Overview</h3>
        {/* Error UI */}
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg p-4 text-white">
      <h3 className="text-xl font-semibold mb-3">Positions Overview</h3>
      
      {positions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No positions found</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr]  text-xs text-gray-400 border-b border-gray-600 mb-2">
            <div></div>
            <div className="text-right">Symbol</div>
            <div className="text-center ml-4">Price</div>
            <div className="text-center">Value</div>
            <div className="text-left">1D Return</div>
            <div className="text-left">1M Chart</div>
          </div>

          {/* Positions List */}
          <div className="space-y-1 max-h-[20.4rem] overflow-y-auto custom-scrollbar">
            {positions.map((position) => {
              const isPositive = position.change >= 0;
              const hasData = position.historicalPrices.length > 1;
              const totalValue = position.currentPrice * position.quantity;
              const chartColor = isPositive ? '#22c55e' : '#ef4444';
              
              return (
                <div 
                  key={position.symbol} 
                  className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-3 py-2 px-3 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors duration-200 items-center"
                >
                  {/* Company Logo */}
                  <div className="flex items-center">
                    <CompanyLogo symbol={position.symbol} logo={position.logo} name={position.name} />
                  </div>
                  
                  {/* Symbol */}
                  <div className="flex flex-col min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{position.symbol}</div>
                  </div>
                  
                  {/* Current Price */}
                  <div className="text-white text-sm font-medium ">
                    ${position.currentPrice.toFixed(2)}
                  </div>
                  
                 
                  
                  {/* Total Value */}
                  <div className="text-white text-sm font-medium">
                    {formatValue(totalValue)}
                  </div>

                  {/* 1D Return */}
                  <div className="flex flex-col">
                    {hasData ? (
                      <>
                        <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{position.changePercent.toFixed(1)}%
                        </div>
                        <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}${Math.abs(position.change).toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">--</div>
                    )}
                  </div>
                  
                  {/* 1M Chart */}
                  <div className="flex justify-center">
                    {hasData ? (
                      <SimpleSparkline data={position.historicalPrices} color={chartColor} width={60} height={24} />
                    ) : (
                      <div className="w-15 h-6 bg-gray-600 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">--</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}