'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession

interface TradeInfo {
  ticker: string;
  shares: number;
  price: number;
  type: string;
  onTradeComplete: (result: { success: boolean; message: string }) => void;
}

export function TradeButton({ ticker, shares, price, type, onTradeComplete }: TradeInfo) {
  const [isLoading, setIsLoading] = useState(false);


  const executeTradeApi = async () => {
    // Check if user is authenticated
   
    if (shares <= 0) {
      onTradeComplete({
        success: false,
        message: "Please enter a valid number of shares"
      });
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
          shares,
          price,
          type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Trade failed');
      }

      onTradeComplete({
        success: true,
        message: data.message || `Successfully ${type === 'buy' ? 'purchased' : 'sold'} ${shares} shares of ${ticker}`
      });
      
    } catch (error) {
      onTradeComplete({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during the trade'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={executeTradeApi}
      disabled={isLoading || shares <= 0}
      className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md font-medium mb-4 ${
        isLoading || shares <= 0  ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-600'
      }`}
    >
      {type === 'buy' ? 'Buy' : 'Sell'}
    </button>
  );
}