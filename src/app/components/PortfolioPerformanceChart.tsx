"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Define the shape of our historical data points
interface HistoryData {
  value: number;
  timestamp: string;
}

// Define the possible time ranges
type TimeRange = '1D' | '1W' | '1M' | '1Y';

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
  const [lastValue, setLastValue] = useState<number>(0); // Move to state
  // State to hold the dynamic chart color, defaulting to green
  const [chartColor, setChartColor] = useState('#10b981');

useEffect(() => {
  const fetchAndProcessHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio-history');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const history: HistoryData[] = await response.json();
      
      // Sort by timestamp to ensure chronological order
      const sortedHistory = history.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      let finalData: HistoryData[] = [];
      
      if (timeRange === '1D') {
        // For 1D, start from 9:30 AM today and fill with actual data points
        const today = new Date();
        const marketOpen = new Date();
        marketOpen.setHours(9, 30, 0, 0);
        
        // Filter data from 9:30 AM today onwards
        const todaysData = sortedHistory.filter(point => 
          new Date(point.timestamp) >= marketOpen
        );
        
        if (todaysData.length === 0) {
          // No data yet today - start with market open padding
          finalData = [{
            value: 100000,
            timestamp: marketOpen.toISOString()
          }];
        } else {
          // Use all available data from today
          finalData = todaysData;
          
          // If we don't have a data point at market open, add one
          const firstDataTime = new Date(todaysData[0].timestamp);
          if (firstDataTime > marketOpen) {
            finalData = [{
              value: 100000,
              timestamp: marketOpen.toISOString()
            }, ...todaysData];
          }
        }
      } else {
        // For other time ranges, use the existing logic with fixed data points
        let targetDataPoints: number;
        
        switch (timeRange) {
          case '1W':
            targetDataPoints = 7; // 7 days
            break;
          case '1M':
            targetDataPoints = 30; // 30 days
            break;
          case '1Y':
          default:
            targetDataPoints = 365; // 365 days
            break;
        }

        if (sortedHistory.length === 0) {
          // No historical data - create padding
          finalData = Array.from({ length: targetDataPoints }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (targetDataPoints - i - 1));
            date.setHours(12, 0, 0, 0);
            return {
              value: 100000,
              timestamp: date.toISOString(),
            };
          });
        } else {
          // We have historical data
          const now = new Date();
          let timePoints: Date[] = [];
          
          // Generate the exact time points we want
          for (let i = 0; i < targetDataPoints; i++) {
            const timePoint = new Date();
            timePoint.setDate(now.getDate() - (targetDataPoints - i - 1));
            timePoint.setHours(12, 0, 0, 0); // Middle of day for better matching
            timePoints.push(timePoint);
          }
          
          // For each time point, find the closest data point
          finalData = timePoints.map(targetTime => {
            if (sortedHistory.length === 0) {
              return {
                value: 100000,
                timestamp: targetTime.toISOString()
              };
            }
            
            // Find the closest data point to this target time
            const closestPoint = sortedHistory.reduce((closest, current) => {
              const closestDiff = Math.abs(new Date(closest.timestamp).getTime() - targetTime.getTime());
              const currentDiff = Math.abs(new Date(current.timestamp).getTime() - targetTime.getTime());
              return currentDiff < closestDiff ? current : closest;
            });
            
            // Set max distance based on time range
            let maxDistanceMs: number;
            switch (timeRange) {
              case '1W':
                maxDistanceMs = 24 * 60 * 60 * 1000; // 24 hours
                break;
              case '1M':
                maxDistanceMs = 3 * 24 * 60 * 60 * 1000; // 3 days
                break;
              case '1Y':
                maxDistanceMs = 7 * 24 * 60 * 60 * 1000; // 7 days
                break;
              default:
                maxDistanceMs = 24 * 60 * 60 * 1000;
            }
            
            const timeDiff = Math.abs(new Date(closestPoint.timestamp).getTime() - targetTime.getTime());
            
            if (timeDiff <= maxDistanceMs) {
              return {
                value: closestPoint.value,
                timestamp: targetTime.toISOString() // Use target time for consistent X-axis
              };
            } else {
              // Only use padding if the closest point is too far away
              return {
                value: 100000,
                timestamp: targetTime.toISOString()
              };
            }
          });
        }
      }
      
      // Determine chart color and last value based on actual data
      if (finalData.length > 1) {
        // Find the first and last actual values (not padding)
        const actualValues = finalData.filter(point => point.value !== 100000);
        
        if (actualValues.length >= 2) {
          const firstValue = actualValues[0].value;
          const currentLastValue = actualValues[actualValues.length - 1].value;
          setLastValue(currentLastValue);
          console.log("last value", currentLastValue);
          const newColor = currentLastValue < firstValue ? '#ef4444' : '#10b981';
          setChartColor(newColor);
        } else if (actualValues.length === 1) {
          setLastValue(actualValues[0].value);
          setChartColor('#10b981');
        } else {
          // All values are padding
          setLastValue(100000);
          setChartColor('#10b981');
        }
      } else {
        setLastValue(finalData[0]?.value || 100000);
        setChartColor('#10b981');
      }

      setData(finalData);

    } catch (error) {
      console.error("Failed to process portfolio history:", error);
      setData([]);
      setLastValue(0);
    } finally {
      setLoading(false);
    }
  };

  fetchAndProcessHistory();
}, [timeRange]);
  if (loading) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 text-center h-96 flex items-center justify-center">
        <p className="text-slate-400">Loading Chart...</p>
      </div>
    );
  }

  if (data.length < 1) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 text-center h-96 flex flex-col items-center justify-center">
        <TrendingUp className="mx-auto h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-semibold text-white">Not Enough Data</h3>
        <p className="text-slate-400">Could not retrieve portfolio history at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-4 ">
      <div className='flex justify-between'>
      <div className='text-white text-2xl '>Portfolio Value</div>
      
      <div className="flex justify-end">
        <div className="flex items-center bg-slate-700/50 rounded-md p-1">
          {(['1D', '1W', '1M', '1Y'] as TimeRange[]).map((range) => ( // Added '1D'
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-semibold text-white rounded-md transition-colors duration-200 ${
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
      <div className="text-white text-2xl mb-4">{lastValue.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
})}</div>
      
      
     <div className="h-64 sm:h-72 lg:h-80">
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
  tickFormatter={(str) => {
    const date = new Date(str);
    if (timeRange === '1D') {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (timeRange === '1Y') {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }}
  stroke="#9ca3af"
  fontSize={12}
  interval={timeRange === '1Y' ? 30 : 'preserveStartEnd'}
/>
            <YAxis 
  tickFormatter={(num) => {
    if (num >= 1000) {
      return `$${Math.round(num / 1000)}k`;
    }
    return `$${Math.round(num)}`;
  }}
  stroke="#9ca3af"
  fontSize={12}
  domain={[(dataMin: number) => Math.floor(dataMin * 0.95), (dataMax: number) => Math.ceil(dataMax * 1.05)]}
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