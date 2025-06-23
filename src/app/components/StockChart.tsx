import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

export type TimeRange = '1D' | '1M' | '1Y' | 'ALL';

type StockChartProps = {
   ticker: string;
   period: TimeRange;
   onTimeRangeChange?: (range: TimeRange) => void;
};

export function StockChart({ ticker, period, onTimeRangeChange }: StockChartProps) {
   const chartContainerRef = useRef<HTMLDivElement>(null);
   const [chartData, setChartData] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `/api/stockHistoryApi?ticker=${encodeURIComponent(ticker)}&timeRange=${period}`
            );
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch data');
            }
            
            console.log('Raw API response:', data); // Debug line
            
           const dataArray = data.values || data; // Check for .values first, fallback to data

if (dataArray && dataArray.length > 0) {
    const formattedData = dataArray.map((item: any) => ({
        time: item.time,
        value: item.value
    }));
    console.log('Formatted chart data:', formattedData.slice(0, 3));
    setChartData(formattedData);
} else {
    console.log('No data array found');
    setChartData([]);
}
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch data');
            setChartData([]);
        }
        setIsLoading(false);
    };

    if (ticker) {
        fetchData();
    }
}, [ticker, period]);

   useEffect(() => {
       if (!chartContainerRef.current || chartData.length === 0) return;

       const chart = createChart(chartContainerRef.current, {
           layout: {
               background: { type: ColorType.Solid, color: 'transparent' },
               textColor: 'white',
           },
           grid: {
               vertLines: { visible: false },
               horzLines: { visible: false },
           },
           width: chartContainerRef.current.clientWidth,
           height: 400,
           rightPriceScale: { borderVisible: false },
           timeScale: { borderVisible: false },
       });

       const series = chart.addSeries(AreaSeries, {
           lineColor: '#2962FF',
           topColor: '#2962FF',
           bottomColor: 'rgba(197, 101, 221, 0.28)',
           lineWidth: 2,
       });

       series.setData(chartData);
       chart.timeScale().fitContent();

       const handleResize = () => {
           if (chartContainerRef.current) {
               chart.applyOptions({ width: chartContainerRef.current.clientWidth });
           }
       };

       window.addEventListener('resize', handleResize);

       return () => {
           window.removeEventListener('resize', handleResize);
           chart.remove();
       };
   }, [chartData]);

   const TimeRangeButtons = () => {
       const ranges: { value: TimeRange; label: string }[] = [
           { value: '1D', label: '1D' },
           { value: '1M', label: '1M' },
           { value: '1Y', label: '1Y' },
           { value: 'ALL', label: 'ALL' }
       ];

       return (
           <div style={{ 
               display: 'flex', 
               gap: '8px', 
               marginBottom: '16px',
               justifyContent: 'center'
           }}>
               {ranges.map((range) => (
                   <button
                       key={range.value}
                       onClick={() => onTimeRangeChange?.(range.value)}
                       style={{
                           padding: '8px 16px',
                           border: '1px solid #444',
                           borderRadius: '4px',
                           background: period === range.value ? '#2962FF' : 'transparent',
                           color: 'white',
                           cursor: 'pointer',
                           fontSize: '14px',
                       }}
                   >
                       {range.label}
                   </button>
               ))}
           </div>
       );
   };

   const chartStyle = { 
       width: '100%', 
       height: '400px',
       background: 'transparent',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       color: 'white'
   };

   if (isLoading) {
       return (
           <div>
               {onTimeRangeChange && <TimeRangeButtons />}
               <div style={chartStyle}>Loading {ticker} chart...</div>
           </div>
       );
   }

   if (error) {
       return (
           <div>
               {onTimeRangeChange && <TimeRangeButtons />}
               <div style={{...chartStyle, color: '#ff6b6b', flexDirection: 'column' as const}}>
                   <div>Error loading chart</div>
                   <div style={{ fontSize: '12px', opacity: 0.7 }}>{error}</div>
               </div>
           </div>
       );
   }

   if (chartData.length === 0) {
       return (
           <div>
               {onTimeRangeChange && <TimeRangeButtons />}
               <div style={chartStyle}>No data available for {ticker}</div>
           </div>
       );
   }

   return (
       <div>
           {onTimeRangeChange && <TimeRangeButtons />}
           <div ref={chartContainerRef} style={{ width: '100%', height: '400px', background: 'transparent' }} />
       </div>
   );
}