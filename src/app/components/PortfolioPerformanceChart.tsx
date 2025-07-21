// components/PortfolioPerformanceChart.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface HistoryData {
  value: number;
  timestamp: string;
}

// Helper to format currency for the tooltip and axis
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-600 rounded-md shadow-lg">
        <p className="text-sm text-slate-300">{new Date(label).toLocaleDateString()}</p>
        <p className="font-bold text-emerald-400">{`Value: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export default function PortfolioPerformanceChart() {
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function would typically fetch data from your API
    const fetchPortfolioHistory = async () => {
      try {
        // In a real app, you'd fetch this from an API route:
        // const response = await fetch('/api/user/portfolio-history');
        // const history = await response.json();
        
        // For demonstration, using placeholder data.
        // Replace this with your actual fetch call.
        const mockHistory = [
          { timestamp: '2025-07-18T12:00:00Z', value: 100000 },
          { timestamp: '2025-07-18T16:00:00Z', value: 102500 },
          { timestamp: '2025-07-18T20:00:00Z', value: 101800 },
          { timestamp: '2025-07-19T00:00:00Z', value: 105000 },
          { timestamp: '2025-07-19T04:00:00Z', value: 108200 },
          { timestamp: '2025-07-19T08:00:00Z', value: 107500 },
          { timestamp: '2025-07-19T12:00:00Z', value: 112000 },
          { timestamp: '2025-07-19T16:00:00Z', value: 110500 },
        ];
        setData(mockHistory);

      } catch (error) {
        console.error("Failed to fetch portfolio history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10 text-slate-400">Loading Chart...</div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center">
        <TrendingUp className="mx-auto h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-semibold text-white">Not Enough Data</h3>
        <p className="text-slate-400">Check back later to see your portfolio's performance over time.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-4 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}