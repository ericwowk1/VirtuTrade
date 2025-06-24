// app/components/PositionOverview.tsx
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
  logo: string | null; // Add logo field
  name: string; // Add company name
}

// Simple custom sparkline component with backdrop
const SimpleSparkline = ({ data, color, width = 80, height = 32 }: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create points for the filled area (add bottom corners)
  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Backdrop fill */}
      <polygon
        points={fillPoints}
        fill={color}
        fillOpacity="0.2"
        stroke="none"
      />
      {/* Main line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Add a component for displaying logo with fallback
const CompanyLogo = ({ symbol, logo, name }: { symbol: string; logo: string | null; name: string }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!logo || imgError) {
    // Fallback to symbol initials if no logo or image fails to load
    return (
      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
        {symbol.slice(0, 2)}
      </div>
    );
  }
  
  return (
    <img 
      src={logo} 
      alt={`${name} logo`}
      className="w-8 h-8 rounded-full object-contain bg-white"
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
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

  // Format large numbers (e.g., 1.2M, 1.5K)
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
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h3 className="text-2xl font-semibold mb-6">Positions Overview</h3>
        
        {/* Header */}
        <div className="grid  gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-600 mb-4">
          <div></div> {/* Empty for logo column */}
          <div>Symbol</div>
          <div>Current Price</div>
          <div>Quantity</div>
          <div>Total Value</div>
          <div>1D Return</div>
          <div>1M Chart</div>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="grid  gap-4 px-4 py-3 bg-gray-700 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="w-16 h-6 bg-gray-600 rounded"></div>
              <div className="w-20 h-6 bg-gray-600 rounded"></div>
              <div className="w-20 h-6 bg-gray-600 rounded"></div>
              <div className="w-24 h-6 bg-gray-600 rounded"></div>
              <div className="w-16 h-6 bg-gray-600 rounded"></div>
              <div className="w-20 h-8 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h3 className="text-2xl font-semibold mb-4">Positions Overview</h3>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h3 className="text-2xl font-semibold mb-6">Positions Overview</h3>
      
      {positions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No positions found</p>
        </div>
      ) : (
        <>
          {/* Updated header to include logo column */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_0.7fr] gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-600 mb-4">
            <div></div> {/* Empty for logo column */}
            <div>Symbol</div>
            <div>Current Price</div>
            <div>Quantity</div>
            <div>Total Value</div>
            <div>1D Return</div>
            <div>1M Chart</div>
          </div>

          {/* Position rows */}
          <div className="space-y-2">
            {positions.map((position) => {
              const isPositive = position.change >= 0;
              const hasData = position.historicalPrices.length > 1;
              const totalValue = position.currentPrice * position.quantity;
              const chartColor = isPositive ? '#22c55e' : '#ef4444';
              
              return (
                <div 
                  key={position.symbol} 
                  className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_0.7fr] gap-4 px-4 py-3 bg-gray-700 hover:bg-gray-650 rounded-lg transition-colors duration-200 items-center"
                >
                  {/* Company Logo */}
                  <div className="flex items-center">
                    <CompanyLogo 
                      symbol={position.symbol} 
                      logo={position.logo} 
                      name={position.name}
                    />
                  </div>
                  
                  {/* Symbol */}
                  <div className="flex flex-col">
                    <div className="font-bold text-white text-base">{position.symbol}</div>
                    <div className="text-xs text-gray-400 truncate">{position.name}</div>
                  </div>
                  
                  {/* Current Price */}
                  <div className="text-white text-base font-semibold">
                    ${position.currentPrice.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div className="text-white text-base">
                    {position.quantity}
                  </div>
                  
                  {/* Total Value */}
                  <div className="text-white text-base font-semibold">
                    {formatValue(totalValue)}
                  </div>

                  {/* 1D Return */}
                  <div className="flex flex-col">
                    {hasData ? (
                      <>
                        <div className={`text-base font-semibold ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isPositive ? '+' : ''}{position.changePercent.toFixed(1)}%
                        </div>
                        <div className={`text-sm ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isPositive ? '+' : ''}${Math.abs(position.change).toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">--</div>
                    )}
                  </div>
                  
                  {/* 1M Chart */}
                  <div className="flex justify-center">
                    {hasData ? (
                      <SimpleSparkline 
                        data={position.historicalPrices}
                        color={chartColor}
                        width={80}
                        height={32}
                      />
                    ) : (
                      <div className="w-20 h-8 bg-gray-600 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">No data</span>
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