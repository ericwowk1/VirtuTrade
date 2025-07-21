"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Define the shape of our historical data points
interface HistoryData {
  value: number;
  timestamp: string;
}

let lastValue = 0;

// Define the possible time ranges
type TimeRange = '1W' | '1M' | '1Y';

// Helper to format numbers as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// A custom tooltip for the chart for better styling
const CustomTooltip = ({ active, payload, label, chartColor }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-600 rounded-md shadow-lg">
        <p className="text-sm text-slate-300">{new Date(label).toLocaleDateString()}</p>
        {/* The text color now dynamically matches the chart color */}
        <p className="font-bold" style={{ color: chartColor }}>{`Value: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export function PortfolioPerformanceChart() {
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');
  // State to hold the dynamic chart color, defaulting to green
  const [chartColor, setChartColor] = useState('#10b981');

  useEffect(() => {
    const fetchAndProcessHistory = async () => {
      setLoading(true);
      try {
        let targetDataPoints: number;
        switch (timeRange) {
          case '1W':
            targetDataPoints = 24;
            break;
          case '1Y':
            targetDataPoints = 365;
            break;
          case '1M':
          default:
            targetDataPoints = 30;
            break;
        }

        const response = await fetch('/api/portfolio-history');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const history: HistoryData[] = await response.json();
        
        let finalData: HistoryData[] = [];

        if (history.length < targetDataPoints) {
          const pointsToPad = targetDataPoints - history.length;
          const paddedData = Array.from({ length: pointsToPad }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (pointsToPad - i)); 
            return {
              value: 100000,
              timestamp: date.toISOString(),
            };
          });
          finalData = [...paddedData, ...history];
        } else {
          finalData = history.slice(-targetDataPoints);
        }
        
        // Determine chart color based on performance
        if (finalData.length > 1) {
          const firstValue = finalData[0].value;
          lastValue = finalData[finalData.length - 1].value;
          console.log("last value", lastValue)
          // Set color to red for a loss, or green for a gain/no change
          const newColor = lastValue < firstValue ? '#ef4444' : '#10b981';
          setChartColor(newColor);
        } else {
          // Default to green if there's not enough data to compare
          setChartColor('#10b981');
        }

        setData(finalData);

      } catch (error) {
        console.error("Failed to process portfolio history:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessHistory();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center h-96 flex items-center justify-center">
        <p className="text-slate-400">Loading Chart...</p>
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center h-96 flex flex-col items-center justify-center">
        <TrendingUp className="mx-auto h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-semibold text-white">Not Enough Data</h3>
        <p className="text-slate-400">Could not retrieve portfolio history at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-4">
      <div className='flex justify-between'>
      <div className='text-white text-xl mtr'>Portfolio Value</div>
      
      <div className="flex justify-end">
        <div className="flex items-center bg-slate-700/50 rounded-md p-1">
          {(['1W', '1M', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-600/70'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className="text-white text-3xl mb-4">{lastValue.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
})}</div>
      
      
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <defs>
              {/* The gradient now uses the dynamic chartColor state */}
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.7} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(num) => `$${(num / 1000)}k`}
              stroke="#9ca3af"
              fontSize={12}
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            {/* Pass the dynamic color to the tooltip */}
            <Tooltip content={<CustomTooltip chartColor={chartColor} />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
