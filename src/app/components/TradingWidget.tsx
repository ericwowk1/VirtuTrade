'use client';

import { useState, useEffect } from "react";
import { GetBalance } from "@/app/components/GetBalance";
import { TrendingUp, DollarSign, Wallet } from "lucide-react"

interface TradingWidgetProps {
  ticker: string;
  currentPrice: number;
  logo: string;
  name: string;
}

export function TradingWidget({ ticker, currentPrice, logo, name }: TradingWidgetProps) {
  const [shares, setShares] = useState<string>("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeStatus, setTradeStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [ownedShares, setOwnedShares] = useState<number>(0);
  
  const sharesNumber = parseFloat(shares) || 0;
  const estimatedCost = sharesNumber * currentPrice;

  useEffect(() => {
    fetch('/api/balanceApi')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setBalance(data.balance))
      .catch(console.error)
  }, []);

  // Fetch owned shares when ticker or trade status changes
  useEffect(() => {
    if (ticker) {
      fetch(`/api/ownedShares?ticker=${ticker}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then(data => setOwnedShares(data.ownedShares))
        .catch(console.error);
    }
  }, [ticker, tradeStatus]);

  const getMaxShares = () => {
    if (tradeType === 'buy' && balance) {
      return Math.floor(balance / currentPrice);
    } else if (tradeType === 'sell') {
      return ownedShares;
    }
    return 0;
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShares(e.target.value);
  };

  const handleMaxClick = () => {
    const maxShares = getMaxShares();
    setShares(maxShares.toString());
  };

 const executeTradeApi = async () => {
  if (sharesNumber <= 0) {
    setTradeStatus({
      success: false,
      message: "Please enter a valid number of shares"
    });
    // Clear error message after 5 seconds
    setTimeout(() => setTradeStatus(null), 5000);
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/executeTradeApi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticker,
        shares: sharesNumber,
        price: currentPrice,
        type: tradeType
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Trade failed');
    }

    setTradeStatus({
      success: true,
      message: data.message || `Successfully ${tradeType === 'buy' ? 'purchased' : 'sold'} ${sharesNumber} shares of ${ticker}`
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => setTradeStatus(null), 5000);
    
    if (data.success) {
      setShares("");
      // Re-fetch balance after successful trade
      fetch('/api/balanceApi')
        .then(res => res.json())
        .then(data => setBalance(data.balance))
        .catch(console.error);
    }
    
  } catch (error) {
    setTradeStatus({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during the trade'
    });
    // Clear error message after 5 seconds
    setTimeout(() => setTradeStatus(null), 5000);
  } finally {
    setIsLoading(false);
  }
};

  const maxShares = getMaxShares();

  return (   
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg ">
      {/* Header with ticker and price */}
      <div className="flex items-center mb-4">
        <img src={logo} alt={`${ticker} logo`} className="w-10 h-10 rounded-lg" />
        <div className="flex flex-col">
          
          <span className="text-white font-bold text-xl pl-4">{name}</span>
          <div className="text-white font-bold text-xl pl-4">${currentPrice.toFixed(2)}</div>
          
        </div>
        
      </div>
      
      

      {/* Buy/Sell Toggle Buttons */}
      <div className="flex mt-8">
        <button 
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
            tradeType === "buy" 
              ? "bg-green-500 text-white border-green-600" 
              : "bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600"
          }`}
          onClick={() => setTradeType("buy")}
        >
          Buy {ticker}
        </button>
        <button 
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-l-0 border ${
            tradeType === "sell" 
              ? "bg-red-500 text-white border-red-600" 
              : "bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600"
          }`}
          onClick={() => setTradeType("sell")}
        >
          Sell {ticker}
        </button>
      </div>

      {/* Show owned shares when in sell mode */}
      {tradeType === 'sell' && ownedShares > 0 && (
        <div className="text-sm text-gray-400 mb-3">
          You own: {ownedShares.toLocaleString()} shares
        </div>
      )}

      {/* Order Type */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-[1rem] mt-[1rem]">Order Type</label>
        <select 
          className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-cyan-500 focus:outline-none text-sm"
        >
          <option value="Market">Market</option>
        </select>
      </div>

      {/* Number of Shares */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">Number of Shares</label>
        <div className="relative">
          <input 
            type="number" 
            value={shares}
            onChange={handleSharesChange}
            placeholder="0"
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-cyan-500 focus:outline-none text-sm pr-12"
          />
          <button
            onClick={handleMaxClick}
            disabled={maxShares === 0}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded ${
              maxShares > 0 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            MAX
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Max: {maxShares.toLocaleString()} shares
          {tradeType === 'sell' && ownedShares === 0 && (
            <span className="text-red-400 ml-2">(You don't own any shares)</span>
          )}
        </div>
      </div>

      {/* Estimated Cost/Proceeds */}
      <div className="flex justify-between items-center text-white text-md mt-4 w-full">
        <div className="flex items-center">
        
          <div className="ml-1">
            {tradeType === 'buy' ? 'Estimated Cost' : 'Estimated Proceeds'}
          </div>
        </div>
        <div className="text-white text-md">
          {estimatedCost.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
}) }
        </div>
      </div>

      {/* Status Message */}
      {tradeStatus && (
        <div className={`mb-4 p-2 rounded text-sm ${
          tradeStatus.success 
            ? 'bg-green-900/50 text-green-200 border border-green-700' 
            : 'bg-red-900/50 text-red-200 border border-red-700'
        }`}>
          {tradeStatus.message}
        </div>
      )}

      {/* Trade Button */}
      <div className="mt-12">
      <button 
        onClick={executeTradeApi}
        disabled={isLoading || sharesNumber <= 0}
        className={`w-full py-3 rounded font-medium text-sm transition-colors ${
          tradeType === 'buy'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        } ${
          isLoading || sharesNumber <= 0 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
      >
        {isLoading 
          ? 'Processing...' 
          : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${sharesNumber > 0 ? sharesNumber : '0'} Shares`
        }
      </button>
      </div>

      {/* Available Balance */}
      <div className="mt-4">
        <div className="flex items-center text-green-400 text-sm">
          <Wallet className="w-4 h-4 text-emerald-400 mr-2" />
          <span>Available Balance</span>
          <span className="ml-auto">
            <GetBalance />
          </span>
        </div>
      </div>
    </div>
  );
}