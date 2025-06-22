// TradingWidget.tsx (Client Component)
'use client';

import { useState } from "react";
import { GetBalance } from "@/app/components/GetBalance";
import { TradeButton } from "@/app/components/TradeButton";

interface TradingWidgetProps {
  ticker: string;
  currentPrice: number;
}

export function TradingWidget({ ticker, currentPrice }: TradingWidgetProps) {
  const [shares, setShares] = useState<string>("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeStatus, setTradeStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const sharesNumber = parseFloat(shares) || 0;
  const estimatedCost = sharesNumber * currentPrice;

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShares(e.target.value);
  };

  // Handle the result from TradeButton
  const handleTradeComplete = (result: { success: boolean; message: string }) => {
    setTradeStatus(result);
    
    if (result.success) {
      // Clear the shares input on successful trade
      setShares("");
    }
  };

  return (   
    <div className="flex flex-col p-6 bg-gray-800 rounded-lg mr-8 w-150 h-210">
      {/* Header Tabs */}
      <div className="flex flex-row mb-6 border-b border-gray-600">
        <button 
          className={`text-white pb-6 py-6 mr-6 border-b-2 ${tradeType === "buy" ? "border-teal-500" : "border-transparent"} text-2xl font-bold`}
          onClick={() => setTradeType("buy")}
        >
          Buy {ticker}
        </button>
        <button 
          className={`text-white pb-6 py-6 mr-6 border-b-2 ${tradeType === "sell" ? "border-teal-500" : "border-transparent"} text-2xl font-bold`}
          onClick={() => setTradeType("sell")}
        >
          Sell {ticker}
        </button>
      </div>

      {/* Order Type */}
      <div className="mb-8">
        <label className="block text-gray-300 text-xl mb-4">Order Type</label>
        <select 
          id="orderType"
          className="w-full bg-gray-700 text-white p-2 mb-4 rounded border border-gray-600 focus:border-teal-500"
        >
          <option value="Market">Market</option>
        </select>
      </div>

      {/* Buy/Sell Shares */}
      <div className="mb-4">
        <label className="block text-gray-300 text-xl mb-4">
          {tradeType === "buy" ? "Buy" : "Sell"} Shares
        </label>
        <input 
          type="number" 
          value={shares}
          onChange={handleSharesChange}
          placeholder="0"
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-500"
        />
      </div>

      {/* Estimated Cost/Proceeds */}
      <div className="mb-6">
        <div className="flex justify-between text-gray-300 text-3xl mb-12 py-6">
          <span>{tradeType === "buy" ? "Estimated Cost" : "Estimated Proceeds"}</span>
          <span>${estimatedCost.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) || '0.00'}</span>
        </div>
      </div>

      {/* Status Message */}
      {tradeStatus && (
        <div className={`mb-4 p-3 rounded ${tradeStatus.success ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
          {tradeStatus.message}
        </div>
      )}

      {/* Trade Button */}
      <TradeButton 
        ticker={ticker}
        shares={sharesNumber}
        price={currentPrice}
        type={tradeType}
        onTradeComplete={handleTradeComplete}
      />

      {/* Available Funds */}
      <div className="text-center text-green-400 text-2xl py-6 mb-4">
        <GetBalance />
      </div>

      <div className="py-24 text-sm">
        <h4>Stock Prices update upon reload due to free API limits. Refresh for updated prices 

        </h4>
        
      </div>
    </div>
  );
}