// app/api/cron/update-history/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';
import { getStockData } from '@/services/getStockData';

interface StockData {
  c: number; // current price
}

export async function POST(request: Request) {
  // 1. Authenticate the request
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch all users with their stocks
    const users = await prisma.user.findMany({
      select: {
        id: true,
        money: true,
        portfolioHistory: true,
        stocks: {
          select: {
            symbol: true,
            quantity: true,
            averagePrice: true,
          },
        },
      },
    });

    // 3. Calculate portfolio value for each user and update
    for (const user of users) {
      let stockValue = 0;

      for (const stock of user.stocks) {
        try {
          const stockData = (await getStockData(stock.symbol)) as StockData;
          stockValue += (stockData?.c ?? stock.averagePrice) * stock.quantity;
        } catch (error) {
          console.error(`Failed to fetch price for ${stock.symbol}, using average price.`);
          stockValue += stock.averagePrice * stock.quantity;
        }
      }

      const totalPortfolioValue = (user.money || 0) + stockValue;
      const timestamp = new Date().toISOString();

      // Create the new history entry
      const newHistoryEntry = {
        value: totalPortfolioValue,
        timestamp: timestamp,
      };

      // Ensure portfolioHistory is an array before pushing
      const currentHistory = Array.isArray(user.portfolioHistory) ? user.portfolioHistory : [];
      
      // Prisma requires the JSON field to be updated with a new array
      await prisma.user.update({
        where: { id: user.id },
        data: {
          portfolioHistory: {
            push: newHistoryEntry,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated portfolio history for ${users.length} users.`,
    });

  } catch (error) {
    console.error('Error updating portfolio history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}