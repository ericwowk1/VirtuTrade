// app/api/Piechart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { PrismaClient } from "@/generated/prisma";
import { getStockData } from '@/services/getStockData'; // ✅ Import the same function

const prisma = new PrismaClient();

interface StockData {
  c: number; // current price
  pc: number; // previous close
  dp: number; // daily percent change
}

export async function GET(request: NextRequest) {
  try {
    // Get session to get user ID
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's cash balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { money: true }
    });

    // Get all stocks for the user
    const stocks = await prisma.stock.findMany({
      where: { userId },
      select: {
        symbol: true,
        quantity: true,
        averagePrice: true
      }
    });

   
    const positions = await Promise.all(
      stocks.map(async (stock) => {
        try {
          // Fetch live stock price
          const stockData = await getStockData(stock.symbol) as StockData;
          const currentPrice = stockData.c; // Live current price
          const currentValue = stock.quantity * currentPrice;
          
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            currentPrice,
            currentValue
          };
        } catch (error) {
          console.error(`Error fetching ${stock.symbol}:`, error);
        
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            currentPrice: stock.averagePrice,
            currentValue: stock.averagePrice * stock.quantity
          };
        }
      })
    );

    // Add cash as a position
    const cashAmount = user?.money || 0;
    if (cashAmount > 0) {
      positions.push({
        symbol: 'CASH',
        quantity: 1,
        averagePrice: cashAmount,
        currentPrice: cashAmount,
        currentValue: cashAmount
      });
    }

    // Calculate total portfolio value (including cash)
    const totalValue = positions.reduce((sum, position) => sum + position.currentValue, 0);

    // Add percentage to each position
    const positionsWithPercentage = positions.map(position => ({
      ...position,
      percentage: totalValue > 0 ? (position.currentValue / totalValue) * 100 : 0
    }));

    return NextResponse.json({ 
      positions: positionsWithPercentage,
      totalValue 
    });

  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}