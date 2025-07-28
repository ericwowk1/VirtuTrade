'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { TradingWidget } from "@/app/components/TradingWidget"
import { StockChart } from "@/app/components/StockChart"

interface StockInfo {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface BasicFinancials {
  metric: {
  [key: string]: number | string;
  };
  metricType: string;
  series: {
  [key: string]: any[];
  };
  symbol: string;
}

interface StockData {
  ticker: string;
  c: number; // current price
  pc: number; // previous close
  d: number; // change
  dp: number; // percent change
  logo: string;
  name: string;
  stockInfo?: StockInfo;
}

type TimePeriod = '1D' | '1M' | '1Y' | 'ALL';

export default function Ticker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ticker = pathname.split("/")[2];
  const name = searchParams.get('name');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [basicFinancials, setBasicFinancials] = useState<BasicFinancials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1D');

  useEffect(() => {
  const fetchInitialData = async () => {
   try {
    setLoading(true);
    
    // Fetch both stock data and basic financials
    const [stockResponse, financialsResponse] = await Promise.all([
     fetch(`/api/stockApi?ticker=${encodeURIComponent(ticker)}`),
     fetch(`/api/stockBasicFinancials?ticker=${encodeURIComponent(ticker)}`)
    ]);
    
    if (!stockResponse.ok) throw new Error('Failed to fetch stock data');
    if (!financialsResponse.ok) throw new Error('Failed to fetch financials data');
    
    const stockResult = await stockResponse.json();
    const financialsResult = await financialsResponse.json();
    
    setStockData(stockResult);
    setBasicFinancials(financialsResult);
    setError(null);
   } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
   } finally {
    setLoading(false);
   }
  };
  
  fetchInitialData();
  }, [ticker]);

  // Second useEffect - Price updates only
  useEffect(() => {
  if (!stockData) return;
  
  const fetchPriceUpdate = async () => {
   try {
 const response = await fetch(`/api/stockApi?ticker=${encodeURIComponent(ticker)}&priceOnly=true`);
    if (!response.ok) throw new Error('Failed to fetch stock data');
    const result = await response.json();
    
    setStockData(prevData => ({
     ...result,
     logo: prevData!.logo,
     name: prevData!.name,
     stockInfo: prevData!.stockInfo // Preserve stockInfo during price updates
    }));
    
    setError(null);
   } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
   }
  };
  
  const intervalId = setInterval(fetchPriceUpdate, 10000);
  
  return () => clearInterval(intervalId);
  }, [ticker, stockData]);

  const formatMarketCap = (value: number) => {
  if (value >= 1_000_000_000_000) { // Trillions
   return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  } else if (value >= 1_000_000_000) { // Billions
   return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) { // Millions
   return `$${(value / 1_000_000).toFixed(1)}M`;
  } else {
   return `$${value.toFixed(1)}`; // Less than a million
  }
  };

  const formatSharesOutstanding = (value: number) => {
  if (value >= 1_000_000_000) { // Billions
   return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) { // Millions
   return `${(value / 1_000_000).toFixed(2)}M`;
  } else {
   return `${value.toFixed(2)}`; // Less than a million
  }
  };

  const formatIpoDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'long',
   day: 'numeric'
  });
  };

  const formatFinancialValue = (value: number | string, isPercentage: boolean = false, isCurrency: boolean = false): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return 'N/A';
  
  if (isPercentage) {
   return `${(value as number).toFixed(1)}%`;
  }
  
  if (isCurrency) {
   const num = value as number;
   if (Math.abs(num) >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
   } else if (Math.abs(num) >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
   } else if (Math.abs(num) >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
   } else {
    return `$${num.toFixed(2)}`;
   }
  }
  
  return (value as number).toFixed(2);
  };

  const getKeyFinancialMetrics = (metrics: any) => {
  if (!metrics) return [];
  
  return [
   { label: "52W High", value: metrics["52WeekHigh"], format: "currency", color: "text-green-500" },
   { label: "P/E", value: metrics.peBasicExclExtraTTM, format: "number", color: "text-blue-400" },
   { label: "EPS", value: metrics.epsBasicExclExtraTTM, format: "currency", color: "text-green-400" },
   { label: "ROE", value: metrics.roeRfy, format: "percentage", color: "text-yellow-400" },
   { label: "52W Low", value: metrics["52WeekLow"], format: "currency", color: "text-red-500" },
   { label: "P/B", value: metrics.pbAnnual, format: "number", color: "text-blue-400" },
   { label: "ROA", value: metrics.roaRfy, format: "percentage", color: "text-yellow-400" },
   { label: "Gross Margin", value: metrics.grossMarginTTM, format: "percentage", color: "text-purple-400" },
   { label: "Net Margin", value: metrics.netProfitMarginTTM, format: "percentage", color: "text-purple-400" },
   { label: "Current Ratio", value: metrics.currentRatioAnnual, format: "number", color: "text-cyan-400" },
   { label: "D/E", value: metrics.totalDebt2EquityAnnual, format: "number", color: "text-cyan-400" },
   { label: "Beta", value: metrics.beta, format: "number", color: "text-orange-400" },
  ];
  };

  if (loading) return (
  <div className="flex items-center justify-center min-h-screen text-white p-4">
   <div className="text-center">
    <h1 className="text-xl md:text-2xl">Loading...</h1>
   </div>
  </div>
  );

  if (error || !stockData) return (
  <div className="flex items-center justify-center min-h-screen text-white p-4">
   <div className="text-center">
    <h1 className="text-xl md:text-2xl">${ticker}</h1>
    <h1 className="text-red-500 mt-2">{error || 'Data not available'}</h1>
   </div>
  </div>
  );
  
  const timePeriods: TimePeriod[] = ['1D', '1M', '1Y', 'ALL'];
  const keyMetrics = getKeyFinancialMetrics(basicFinancials?.metric);
  
  return (
    <div className="flex flex-col lg:flex-row text-white min-h-screen">
      {/* Main content - Stock info and chart */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 xl:pl-28 2xl:pl-56">
        {/* Top row - Logo and basic info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 md:mb-8">
          {stockData.logo && (
            <img 
              src={stockData.logo} 
              alt={`${ticker} logo`} 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" 
            />
          )}
          
          <div className="flex flex-col text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              {stockData.name || name} ({ticker})
            </h1>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-4 mt-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                ${stockData.c.toFixed(2)}
              </h2>
              <div className={`text-sm sm:text-base md:text-lg ${stockData.d < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {stockData.d < 0 ? '-' : '+'}${Math.abs(stockData.d).toFixed(2)} ({stockData.dp.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-4 md:mb-6">
          <StockChart 
            ticker={ticker} 
            period={selectedPeriod}
            currentPrice={stockData.c}  
          />
        </div>

        {/* Time Period Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center sm:justify-start">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ${
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

        {/* Trading Widget (Mobile/Tablet View) - Visible only on sm/md screens */}
        <div className="lg:hidden mb-6 md:mb-8">
          <TradingWidget 
            ticker={ticker} 
            currentPrice={stockData.c} 
            logo={stockData.logo} 
            name={stockData.name}
          />
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Company Profile Section */}
          {stockData.stockInfo && (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-blue-400">Company Overview</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Industry</h3>
                    <p className="text-sm md:text-base text-white font-medium group-hover:text-blue-300 transition-colors">
                      {stockData.stockInfo.finnhubIndustry}
                    </p>
                  </div>
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Exchange</h3>
                    <p className="text-sm md:text-base text-white font-medium group-hover:text-blue-300 transition-colors">
                      {stockData.stockInfo.exchange}
                    </p>
                  </div>
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Website</h3>
                    <a
                      href={stockData.stockInfo.weburl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-blue-400/30 hover:decoration-blue-300 font-medium break-all"
                    >
                      {stockData.stockInfo.weburl.replace("https://", "").replace("www.", "")}
                    </a>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Market Cap</h3>
                    <p className="text-base md:text-lg text-white font-bold group-hover:text-green-300 transition-colors">
                      {formatMarketCap(stockData.stockInfo.marketCapitalization)}
                    </p>
                  </div>
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Shares Outstanding</h3>
                    <p className="text-sm md:text-base text-white font-medium group-hover:text-blue-300 transition-colors">
                      {formatSharesOutstanding(stockData.stockInfo.shareOutstanding)}
                    </p>
                  </div>
                  <div className="group">
                    <h3 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">IPO Date</h3>
                    <p className="text-sm md:text-base text-white font-medium group-hover:text-blue-300 transition-colors">
                      {formatIpoDate(stockData.stockInfo.ipo)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Metrics Section */}
          {basicFinancials && (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-blue-400">Key Financial Metrics</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {keyMetrics.slice(0, 8).map((metric, index) => (
                  <div
                    key={index}
                    className="group bg-gray-700/30 rounded-lg md:rounded-xl p-2 md:p-3 border border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <span className="text-xs text-gray-400 mb-1 block font-medium uppercase tracking-wider">{metric.label}</span>
                      <span className={`text-xs md:text-sm font-bold ${metric.color} group-hover:scale-110 transition-transform duration-200 inline-block`}>
                        {metric.format === "percentage"
                          ? formatFinancialValue(metric.value, true)
                          : metric.format === "currency"
                          ? formatFinancialValue(metric.value, false, true)
                          : formatFinancialValue(metric.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trading Widget (Desktop Sidebar View) - Hidden on sm/md, visible on lg+ */}
      <div className="hidden lg:block w-full lg:pr-12 lg:w-2/5 xl:w-2/5 2xl:w-[40rem] 2xl:pr-[3rem] p-4 md:p-6 lg:p-8  lg:top-0 lg:h-screen">
        <TradingWidget 
          ticker={ticker} 
          currentPrice={stockData.c} 
          logo={stockData.logo} 
          name={stockData.name}
        />
      </div>
    </div>
  );
}