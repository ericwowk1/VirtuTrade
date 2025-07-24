'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { TradingWidget } from "@/app/components/TradingWidget"
import { StockChart } from "@/app/components/StockChart"

interface StockData {
  ticker: string;
  c: number; // current price
  pc: number; // previous close
  d: number; // change
  dp: number; // percent change
  logo: string;
  name: string;
}

type TimePeriod = '1D' | '1M' | '1Y' | 'ALL';

export default function Ticker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ticker = pathname.split("/")[2];
  const name = searchParams.get('name');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1D');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stockApi?ticker=${encodeURIComponent(ticker)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        console.log("resulttt", result);
        setStockData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  if (loading) return (
    <div className="flex flex-row text-white">
      <div className="flex flex-col">
        <h1>Loading...</h1>
      </div>
    </div>
  );

  if (error || !stockData) return (
    <div className="flex flex-row text-white">
      <div className="flex flex-col">
        <h1>${ticker}</h1>
        <h1 className="text-red-500">{error || 'Data not available'}</h1>
      </div>
    </div>
  );

  console.log("This is stockData object", stockData)

  const timePeriods: TimePeriod[] = ['1D', '1M', '1Y', 'ALL'];
   
  return (
  <div className="flex flex-row text-white min-h-screen">
    {/* First column - Stock info and chart */}
    <div className="flex flex-col w-2/3 pl-[14rem] py-[3rem]">
      {/* Top row - Logo and basic info */}
      <div className="flex flex-row items-start mb-8">
        {stockData.logo && (
          <img src={stockData.logo} alt={`${ticker} logo`} className="w-32 h-32 mr-8" />
        )}
        
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-2">{stockData.name || name} ({ticker})</h1>
          <div className="flex flex-row items-center">
            <h1 className="text-5xl font-semibold">${stockData.c.toFixed(2)}</h1>
            {stockData.d < 0 ? 
              <h1 className="text-red-500 text-2xl pl-6">$-{Math.abs(stockData.d).toFixed(2)} ({stockData.dp.toFixed(2)}%)</h1> : 
              <h1 className="text-green-500 text-2xl pl-6">$+{stockData.d.toFixed(2)} ({stockData.dp.toFixed(2)}%)</h1>
            }
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="">
        <StockChart ticker={ticker} period={selectedPeriod}/>
      </div>

      {/* Time Period Buttons */}
      <div className="flex flex-row gap-4 mt-6">
        {timePeriods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
  selectedPeriod === period
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600'
}`}
          >
            {period === '1D' ? '1 Day' : 
             period === '1M' ? '1 Month' : 
             period === '1Y' ? '1 Year' : 
             'All Time'}
          </button>
        ))}
      </div>
    </div>

    {/* Second column - Trading Widget */}
    <div className="flex flex-col w-1/4 ml-12 py-12">
      <TradingWidget ticker={ticker} currentPrice={stockData.c} logo={stockData.logo} name={stockData.name}/>
    </div>
  </div>
);
 
}