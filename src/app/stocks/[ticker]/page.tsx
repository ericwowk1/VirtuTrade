'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { TradingWidget } from "@/app/components/TradingWidget"

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
  return (
    
    <div className="flex flex-row text-white">
   
      {/* first row's columns - made smaller with left padding */}
      
      <div className="flex flex-row w-2/3 pl-32  ">
        {/* Logo - made smaller */}
        {companyInfo?.logo && (
          <img src={companyInfo.logo} alt={`${ticker} logo`} className="w-42 h-42 mr-4 py-25" />
        )}
        
        {/* Text content container */}
        <div className="flex flex-col py-30">
          {/* Name row - made smaller */}
          <h1 className="text-3xl mb-8">{name} ({ticker})</h1>
          
          {/* Price and change row - made smaller */}
          <div className="flex flex-row items-center">
            <h1 className="text-4xl">${quoteData.c.toFixed(2)}</h1>
            {quoteData.d < 0 ? 
              <h1 className="text-red-500 text-xl pl-4">$-{Math.abs(quoteData.d).toFixed(2)} ({quoteData.dp.toFixed(2)}%)</h1> : 
              <h1 className="text-green-500 text-xl pl-4">$+{quoteData.d.toFixed(2)} ({quoteData.dp.toFixed(2)}%)</h1>
            }
          </div>
        </div>
      </div>
   
    {/* 2nd column - Trading Widget with right padding */}
    <div className="flex flex-col w-1/3 pr-32 py-25">
      <TradingWidget ticker={ticker} currentPrice={quoteData.c} />

      {/* Add to Watchlist */}
      <button className="mt-4 text-purple-400 hover:text-purple-300 text-lg py-4 border-3 border-purple-400 rounded-md w-150 font-bold">
  Add to Watchlist
</button>
    </div>

    
    </div>
  );
 
}