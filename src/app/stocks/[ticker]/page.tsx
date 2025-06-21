'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { TradingWidget } from "@/app/components/TradingWidget"
import { StockChart } from "@/app/components/StockChart"


interface StockQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
}

interface StockInfo {
  logo: string;
}

interface CombinedStockData {
  ticker: string;
  data: StockQuote;
  info: StockInfo;
}

export default function Ticker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ticker = pathname.split("/")[2];
  const name = searchParams.get('name');
  const [stockData, setStockData] = useState<CombinedStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Destructure the combined data
  const { data: quoteData, info: companyInfo } = stockData;

  console.log("This is stockData object", stockData)
   console.log("This is quoteData object", quoteData)
     console.log("This is companyInfo object", companyInfo)

   
  return (
  <div className="flex flex-row text-white min-h-screen">
    {/* First column - Stock info and chart */}
    <div className="flex flex-col w-2/3 pl-32 py-12">
      {/* Top row - Logo and basic info */}
      <div className="flex flex-row items-start mb-8">
        {companyInfo?.logo && (
          <img src={companyInfo.logo} alt={`${ticker} logo`} className="w-32 h-32 mr-8" />
        )}
        
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-2">{name} ({ticker})</h1>
          <div className="flex flex-row items-center">
            <h1 className="text-5xl font-semibold">${quoteData.c.toFixed(2)}</h1>
            {quoteData.d < 0 ? 
              <h1 className="text-red-500 text-2xl pl-6">$-{Math.abs(quoteData.d).toFixed(2)} ({quoteData.dp.toFixed(2)}%)</h1> : 
              <h1 className="text-green-500 text-2xl pl-6">$+{quoteData.d.toFixed(2)} ({quoteData.dp.toFixed(2)}%)</h1>
            }
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="" >
        <StockChart ticker={ticker} />
      </div>
    </div>

    {/* Second column - Trading Widget */}
    <div className="flex flex-col w-1/3  ml-12 py-12">
      <TradingWidget ticker={ticker} currentPrice={quoteData.c} />
    </div>
  </div>
);
 
}