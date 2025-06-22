// src/utils/portfolioCalculator.ts
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Fetch current stock price from an API
async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    // Replace with your actual stock API
    const response = await axios.get(`https://api.example.com/stocks/${symbol}`);
    return response.data.price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Calculate total portfolio value for a user
export async function calculatePortfolioValue(userId: string): Promise<number> {
  // Get user and their stocks
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { stocks: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  // Calculate stocks value
  let stocksValue = 0;
  for (const stock of user.stocks) {
    const currentPrice = await fetchStockPrice(stock.symbol);
    if (currentPrice) {
      stocksValue += stock.quantity * currentPrice;
    }
  }

  // Add cash to total value
  const totalValue = stocksValue + (user.money || 0);

  return totalValue;
}

// Update the last checked value for all users
export async function updateAllLastCheckedValues(): Promise<void> {
  const users = await prisma.user.findMany({
    select: { id: true },
  });
  
  console.log(`Updating portfolio values for ${users.length} users`);
  
  for (const user of users) {
    try {
      const portfolioValue = await calculatePortfolioValue(user.id);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastCheckedValue: portfolioValue,
        },
      });
      
      console.log(`Updated portfolio for user ${user.id}: ${portfolioValue}`);
    } catch (error) {
      console.error(`Error updating portfolio for user ${user.id}:`, error);
    }
  }
}

// Get top gainers and losers
export async function getTopGainersAndLosers(limit: number = 5): Promise<{
  gainers: any[];
  losers: any[];
}> {
  // Get all users with their last checked values
  const users = await prisma.user.findMany({
    where: {
      lastCheckedValue: { not: null },
    },
    select: {
      id: true,
      name: true,
      image: true,
      lastCheckedValue: true,
      stocks: true,
      money: true,
    },
  });

  const results = [];

  // Calculate current values and changes
  for (const user of users) {
    const currentValue = await calculatePortfolioValue(user.id);
    const previousValue = user.lastCheckedValue || 0;
    
    // Skip if we don't have valid previous data
    if (previousValue <= 0) continue;

    const change = currentValue - previousValue;
    const percentChange = (change / previousValue) * 100;
    
    results.push({
      userId: user.id,
      name: user.name || 'Anonymous',
      image: user.image,
      currentValue,
      previousValue,
      change,
      percentChange,
    });
  }

  // Sort by absolute change
  const sortedResults = [...results].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  
  // Split into gainers and losers
  const gainers = sortedResults
    .filter(user => user.change > 0)
    .slice(0, limit);
    
  const losers = sortedResults
    .filter(user => user.change < 0)
    .slice(0, limit);

  return { gainers, losers };
}