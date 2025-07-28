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

// Configuration for each time range
const TIME_RANGE_CONFIG = {
  '1D': { 
    dataPoints: 24, // 24 points for hourly data
    hours: 24,
    sampleInterval: 1 // Use every data point (hourly)
  },
  '1W': { 
    dataPoints: 7, // 7 points for daily data
    hours: 24 * 7,
    sampleInterval: 24 // Use one point per day (every 24 hours)
  },
  '1M': { 
    dataPoints: 60, // 60 points for 12-hour intervals
    hours: 24 * 30,
    sampleInterval: 12 // Use one point every 12 hours
  },
  '1Y': { 
    dataPoints: 365, // 365 points for daily data
    hours: 24 * 365,
    sampleInterval: 24 // Use one point per day (every 24 hours)
  }
};

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
        <p className="font-bold" style={{ color: chartColor }}>{`Value: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

// Helper function to sample data at specified intervals
const sampleData = (data: HistoryData[], intervalHours: number): HistoryData[] => {
  if (data.length === 0) return [];
  
  const result: HistoryData[] = [];
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  let lastAddedTime = 0;
  
  for (const point of sortedData) {
    const pointTime = new Date(point.timestamp).getTime();
    
    if (pointTime - lastAddedTime >= intervalMs || result.length === 0) {
      result.push(point);
      lastAddedTime = pointTime;
    }
  }
  
  return result;
};

// Helper function to generate padding data points
const generatePaddingData = (count: number, endTime: Date, intervalHours: number, defaultValue: number = 100000): HistoryData[] => {
  const result: HistoryData[] = [];
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(endTime.getTime() - (i * intervalMs));
    result.push({
      value: defaultValue,
      timestamp: timestamp.toISOString()
    });
  }
  
  return result;
};

// Helper function to get market hours for 1D view
const getMarketBounds = () => {
  const today = new Date();
  
  const marketOpen = new Date(today);
  marketOpen.setHours(9, 30, 0, 0);
  
  const marketClose = new Date(today);
  marketClose.setHours(16, 30, 0, 0); // 4:30 PM
  
  return { marketOpen, marketClose };
};

export function PortfolioPerformanceChart() {
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const [lastValue, setLastValue] = useState<number>(0);
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
        
        const config = TIME_RANGE_CONFIG[timeRange];
        let filteredData: HistoryData[];
        
        if (timeRange === '1D') {
          // Special handling for 1D - filter between 9:30 AM and 4:30 PM today
          const { marketOpen, marketClose } = getMarketBounds();
          
          filteredData = history.filter(point => {
            const pointTime = new Date(point.timestamp);
            return pointTime >= marketOpen && pointTime <= marketClose;
          }).sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        } else {
          // Standard time range filtering for other periods
          const now = new Date();
          const cutoffTime = new Date(now.getTime() - (config.hours * 60 * 60 * 1000));
          
          filteredData = history.filter(point => 
            new Date(point.timestamp) >= cutoffTime
          ).sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }
        
        // Sample the data according to the interval for this time range
        const sampledData = config.sampleInterval > 1 
          ? sampleData(filteredData, config.sampleInterval)
          : filteredData;
        
        let finalData: HistoryData[];
        
        if (sampledData.length >= config.dataPoints) {
          // We have enough data, take the last N points
          finalData = sampledData.slice(-config.dataPoints);
        } else {
          // We need to pad with default values
          const paddingNeeded = config.dataPoints - sampledData.length;
          let paddingStartTime: Date;
          
          if (timeRange === '1D') {
            // For 1D, start padding from market open
            paddingStartTime = sampledData.length > 0 
              ? new Date(sampledData[0].timestamp) 
              : getMarketBounds().marketOpen;
          } else {
            // For other ranges, use standard logic
            const now = new Date();
            const cutoffTime = new Date(now.getTime() - (config.hours * 60 * 60 * 1000));
            paddingStartTime = sampledData.length > 0 
              ? new Date(sampledData[0].timestamp) 
              : cutoffTime;
          }
          
          const paddingData = generatePaddingData(
            paddingNeeded, 
            paddingStartTime,
            config.sampleInterval
          );
          
          finalData = [...paddingData, ...sampledData];
        }
        
        // Get the current portfolio value
        const currentPortfolioValue = history.length > 0 ? 
          history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].value : 100000;

        setLastValue(currentPortfolioValue);

        // Calculate color based on first vs last value in the chart
        if (finalData.length >= 2) {
          const firstValue = finalData[0].value;
          const lastValueInChart = finalData[finalData.length - 1].value;
          const newColor = lastValueInChart < firstValue ? '#ef4444' : '#10b981';
          setChartColor(newColor);
        } else {
          setChartColor('#10b981');
        }
        
        setData(finalData);

      } catch (error) {
        console.error("Failed to process portfolio history:", error);
        
        // Fallback: generate padding data for the entire range
        const config = TIME_RANGE_CONFIG[timeRange];
        let paddingStartTime: Date;
        
        if (timeRange === '1D') {
          paddingStartTime = getMarketBounds().marketOpen;
        } else {
          paddingStartTime = new Date();
        }
        
        const paddingData = generatePaddingData(config.dataPoints, paddingStartTime, config.sampleInterval);
        setData(paddingData);
        setLastValue(100000);
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
    <div className="bg-[#0F172A] backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-[2rem]">
      <div className='flex justify-between'>
        <div className='text-white text-2xl'>Portfolio Value</div>
        
        <div className="flex justify-end">
          <div className="flex items-center bg-slate-700/50 rounded-md p-1">
            {(['1D', '1W', '1M', '1Y'] as TimeRange[]).map((range) => (
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
      
      <div className="text-white text-2xl mb-4">
        {lastValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </div>
      
      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <defs>
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
              interval={timeRange === '1Y' ? 30 :
                timeRange === '1D' ? 2 :
                timeRange === '1W' ? 0 :
                 'preserveStartEnd'
                
              }
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