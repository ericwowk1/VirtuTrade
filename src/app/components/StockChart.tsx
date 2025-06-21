import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

export function StockChart({ ticker }: { ticker: string }) {
   const chartContainerRef = useRef<HTMLDivElement>(null);
   const [chartData, setChartData] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
       const fetchData = async () => {
           setIsLoading(true);
           try {
               const response = await fetch(`/api/stockHistoryApi?ticker=${encodeURIComponent(ticker)}`);
               const data = await response.json();
               console.log("data3343", data);
               
               if (data && data.values) {
                   const formattedData = data.values
                       .map((item: any) => ({
                           time: item.datetime,
                           value: parseFloat(item.close)
                       }))
                       .reverse();
                   
                   console.log("formatted data:", formattedData);
                   setChartData(formattedData);
               }
           } catch (error) {
               console.error('Error fetching stock data:', error);
               setChartData([]); // Set empty array on error
           }
           setIsLoading(false);
       };

       if (ticker) {
           fetchData();
       }
   }, [ticker]);

   useEffect(() => {
       if (!chartContainerRef.current || chartData.length === 0) return;

       const chart = createChart(chartContainerRef.current, {
           layout: {
               background: {
                   type: ColorType.Solid,
                   color: 'transparent',
               },
               textColor: 'white',
           },
           grid: {
               vertLines: { visible: false },
               horzLines: { visible: false },
           },
           width: chartContainerRef.current.clientWidth,
           height: 700,
           rightPriceScale: {
               borderVisible: false,
               scaleMargins: {
                   top: 0.1,
                   bottom: 0.1,
               },
           },
           timeScale: {
               borderVisible: false,
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

       chart.applyOptions({
           layout: {
               fontSize: 18,
           },
       });

       const handleResize = () => {
           if (!chartContainerRef.current) return;
           chart.applyOptions({ width: chartContainerRef.current.clientWidth });
       };

       window.addEventListener('resize', handleResize);

       return () => {
           window.removeEventListener('resize', handleResize);
           chart.remove();
       };
   }, [chartData]);

   if (isLoading) {
       return (
           <div 
               style={{ 
                   width: '100%', 
                   height: '300px',
                   background: 'transparent',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: 'white'
               }}
           >
               Loading chart...
           </div>
       );
   }

   if (chartData.length === 0) {
       return (
           <div 
               style={{ 
                   width: '100%', 
                   height: '300px',
                   background: 'transparent',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: 'white'
               }}
           >
               No data available
           </div>
       );
   }

   return (
       <div 
           ref={chartContainerRef}
           style={{ 
               width: '100%', 
               height: '300px',
               background: 'transparent',
           }}
       />
   );
}