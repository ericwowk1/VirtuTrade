// app/components/PortfolioPieChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  percentage: number;
}

// Updated color palette - added gray for cash
const COLORS = [
  '#6366f1', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#6b7280', // Gray for cash
];

export function PortfolioPieChart() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch('/api/Piechart');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        setPositions(data.positions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // Rest of your loading/error states remain the same...

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex items-center mb-6">
        <h3 className="text-3xl font-medium">Portfolio Breakdown</h3>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Legend on the left */}
        <div className="flex-shrink-0 space-y-3">
          {positions.map((position, index) => (
            <div key={position.symbol} className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-3" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div>
                <div className="text-2xl font-medium">
                  {position.symbol === 'CASH' ? 'Cash Available' : position.symbol}
                </div>
                <div className="text-xl text-gray-400">
                  {position.percentage.toFixed(1)}% • ${position.currentValue.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart on the right */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={400} height={400}>
              <PieChart>
                <Pie
                  data={positions}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={200}
                  paddingAngle={2}
                  dataKey="currentValue"
                  stroke="none"
                >
                  {positions.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${positions.reduce((sum, pos) => sum + pos.currentValue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}