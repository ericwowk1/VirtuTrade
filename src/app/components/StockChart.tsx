import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

export type TimeRange = '1D' | '1M' | '1Y' | 'ALL';

type StockChartProps = {
   ticker: string;
   period: TimeRange;
};

export function StockChart({ ticker, period }: StockChartProps) {
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
            
            console.log('Raw API response:', data);
            
           const dataArray = data.values || data;

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
        rightPriceScale: { 
            borderVisible: false,
            textColor: 'white',
        },
        timeScale: { 
            borderVisible: false,
            timeVisible: true,
            secondsVisible: false,
            
            tickMarkFormatter: (time:any) => {
                const date = new Date(time * 1000);
                // For 1 month view, show month/day format consistently
                if (period === '1M') {
                    return date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
                // For 1 day view
                if (period === '1D') {
                    return date.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    });
                }
                // For 1 year view
                if (period === '1Y') {
                    return date.toLocaleDateString('en-US', { 
                        month: 'short',
                        year: '2-digit'
                    });
                }
                // Default for ALL time
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'short'
                });
            }
        },
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
}, [chartData, period]);

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
           <div style={chartStyle}>Loading {ticker} chart...</div>
       );
   }

   if (error) {
       return (
           <div style={{...chartStyle, color: '#ff6b6b', flexDirection: 'column' as const}}>
               <div>Error loading chart</div>
               <div style={{ fontSize: '12px', opacity: 0.7 }}>{error}</div>
           </div>
       );
   }

   if (chartData.length === 0) {
       return (
           <div style={chartStyle}>No data available for {ticker}</div>
       );
   }

   return (
       <div>
           <div ref={chartContainerRef} style={{ width: '100%', height: '420px', background: 'transparent' }} />
       </div>
   );
}