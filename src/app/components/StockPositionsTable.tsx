import React from 'react';
import { PrismaClient } from "@/generated/prisma";
import { getStockData, getStockInfo } from "@/services/getStockData";

// Type definitions
interface Position {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
}

interface StockData {
  c: number; // current price
  pc: number; // previous close
}

interface StockInfo {
  name: string;
}

interface Metrics {
  currentPrice: number;
  totalValue: number;
  allTimeGainLoss: number;
  allTimeGainLossPercent: number;
  todayGainLoss: number;
  todayGainLossPercent: number;
}

interface StockPositionsTableProps {
  userId: string;
}

const prisma = new PrismaClient();

async function getPositionsData(userId: string): Promise<Position[]> {
  try {
    const positions = await prisma.stock.findMany({
      where: { 
        userId: userId
      },
      select: {
        id: true,
        symbol: true,
        quantity: true,
        averagePrice: true
      }
    });
    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
}

export async function StockPositionsTable({ userId }: StockPositionsTableProps) {
  let positions: Position[] = [];
  let stockDataMap: Record<string, StockData> = {};
  let stockInfoMap: Record<string, StockInfo> = {};

  try {
    // Get user positions from database using findMany
    positions = await getPositionsData(userId);
    
    if (positions.length === 0) {
      return (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Common Stock Positions</h3>
          <div className="py-8 text-center text-gray-400">
            No positions found
          </div>
        </div>
      );
    }
    
    // Get current stock prices and info for all positions
    const stockDataPromises = positions.map((position: Position) => 
      getStockData(position.symbol).catch((error: Error) => {
        console.error(`Error fetching stock data for ${position.symbol}:`, error);
        return null;
      })
    );
    
    const stockInfoPromises = positions.map((position: Position) => 
      getStockInfo(position.symbol).catch((error: Error) => {
        console.error(`Error fetching stock info for ${position.symbol}:`, error);
        return null;
      })
    );
    
    const [stockDataResults, stockInfoResults] = await Promise.all([
      Promise.all(stockDataPromises),
      Promise.all(stockInfoPromises)
    ]);
    
    // Create maps of symbol to stock data and info with proper type casting
    stockDataResults.forEach((result: unknown, index: number) => {
      if (result) {
        stockDataMap[positions[index].symbol] = result as StockData;
      }
    });
    
    stockInfoResults.forEach((result: unknown, index: number) => {
      if (result) {
        stockInfoMap[positions[index].symbol] = result as StockInfo;
      }
    });
    
  } catch (error) {
    console.error('Error in StockPositionsTable:', error);
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Common Stock Positions</h3>
        <div className="py-8 text-center text-red-400">
          Error loading positions
        </div>
      </div>
    );
  }

  const calculateMetrics = (position: Position, stockData: StockData | undefined): Metrics => {
    if (!stockData?.c || !position.averagePrice) {
      return {
        currentPrice: 0,
        totalValue: 0,
        allTimeGainLoss: 0,
        allTimeGainLossPercent: 0,
        todayGainLoss: 0,
        todayGainLossPercent: 0
      };
    }

    const currentPrice: number = stockData.c;
    const shares: number = Number(position.quantity) || 0;
    const avgPrice: number = Number(position.averagePrice) || 0;
    
    const totalValue: number = shares * currentPrice;
    const totalCost: number = shares * avgPrice;
    
    const allTimeGainLoss: number = totalValue - totalCost;
    const allTimeGainLossPercent: number = totalCost > 0 ? (allTimeGainLoss / totalCost) * 100 : 0;
    
    // For today's change - using previous close (pc) from Finnhub
    const previousClose: number = stockData.pc || currentPrice;
    const todayGainLoss: number = shares * (currentPrice - previousClose);
    const todayGainLossPercent: number = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

    return {
      currentPrice,
      totalValue,
      allTimeGainLoss,
      allTimeGainLossPercent,
      todayGainLoss,
      todayGainLossPercent
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatPercent = (percent: number): string => {
    const sign: string = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

return (
  <div className="bg-slate-800 rounded-lg p-8">
    <h3 className="text-2xl font-semibold text-white mb-6">Stock Positions</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-base">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700 text-xl">
            <th className="text-left py-4 px-3">Symbol</th>
            <th className="text-left py-4 px-3">Company</th>
            <th className="text-left py-4 px-3">Shares</th>
            <th className="text-left py-4 px-3">Price</th>
            <th className="text-left py-4 px-3">Avg. PPS</th>
            <th className="text-left py-4 px-3">Value</th>
            <th className="text-left py-4 px-3">$ All-Time</th>
            <th className="text-left py-4 px-3">% All-Time</th>
            <th className="text-left py-4 px-3">$ Today</th>
            <th className="text-left py-4 px-3">% Today</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {positions.map((position: Position) => {
            const stockData: StockData | undefined = stockDataMap[position.symbol];
            const stockInfo: StockInfo | undefined = stockInfoMap[position.symbol];
            const metrics: Metrics = calculateMetrics(position, stockData);
            
            return (
              <tr key={position.id} className="border-b border-gray-700">
                <td className="py-4 px-3 text-purple-400 font-medium">
                  {position.symbol}
                </td>
                <td className="py-4 px-3">
                  {stockInfo?.name || 'Loading...'}
                </td>
                <td className="py-4 px-3">{position.quantity}</td>
                <td className="py-4 px-3">
                  {stockData ? formatCurrency(metrics.currentPrice) : 'Loading...'}
                </td>
                <td className="py-4 px-3">
                  {formatCurrency(position.averagePrice || 0)}
                </td>
                <td className="py-4 px-3">
                  {stockData ? formatCurrency(metrics.totalValue) : 'Loading...'}
                </td>
                <td className={`py-4 px-3 ${metrics.allTimeGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData ? `${metrics.allTimeGainLoss >= 0 ? '+' : '-'}${formatCurrency(metrics.allTimeGainLoss)}` : 'Loading...'}
                </td>
                <td className={`py-4 px-3 ${metrics.allTimeGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData ? formatPercent(metrics.allTimeGainLossPercent) : 'Loading...'}
                </td>
                <td className={`py-4 px-3 ${metrics.todayGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData ? `${metrics.todayGainLoss >= 0 ? '+' : '-'}${formatCurrency(metrics.todayGainLoss)}` : 'Loading...'}
                </td>
                <td className={`py-4 px-3 ${metrics.todayGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData ? formatPercent(metrics.todayGainLossPercent) : 'Loading...'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
}