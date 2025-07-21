// services/tradeService.ts

import { prisma } from '@/services/prisma'



interface TradeData {
  userId: string;
  ticker: string;
  shares: number;
  price: number;
  type: string;
}

export async function executeTrade({ userId, ticker, shares, price, type }: TradeData) {
  // Get user with their current balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { money: true }
  });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // Calculate total cost/proceeds
  const total = shares * price;
  
  if (type === 'buy') {
    // Check if user has enough funds
    if (!user.money || user.money < total) {
      throw new Error("Insufficient funds for this transaction");
    }
    
    // Update user's balance
    await prisma.user.update({
      where: { id: userId },
      data: { 
        money: (user.money || 0) - total 
      }
    });
    
    // Check if user already owns this stock
    const existingStock = await prisma.stock.findFirst({
      where: { 
        userId,
        symbol: ticker 
      }
    });
    
    if (existingStock) {
      // Calculate new average price and total quantity
      const totalShares = existingStock.quantity + shares;
      const newAveragePrice = (
        (existingStock.averagePrice * existingStock.quantity) + (price * shares)
      ) / totalShares;
      
      // Update existing position
      await prisma.stock.update({
        where: { id: existingStock.id },
        data: {
          quantity: totalShares,
          averagePrice: newAveragePrice
        }
      });
    } else {
      // Create new stock position
      await prisma.stock.create({
        data: {
          userId,
          symbol: ticker,
          quantity: shares,
          averagePrice: price
        }
      });
    }
  } else if (type === 'sell') {
    // Check if user owns the stock
    const existingStock = await prisma.stock.findFirst({
      where: { 
        userId,
        symbol: ticker 
      }
    });
    
    if (!existingStock || existingStock.quantity < shares) {
      throw new Error(`You don't own enough shares of ${ticker} to sell`);
    }
    
    // Update user's balance
    await prisma.user.update({
      where: { id: userId },
      data: { 
        money: (user.money || 0) + total 
      }
    });
    
    // Update position
    const remainingShares = existingStock.quantity - shares;
    
    if (remainingShares > 0) {
      // Update stock with remaining shares
      await prisma.stock.update({
        where: { id: existingStock.id },
        data: { 
          quantity: remainingShares 
        }
      });
    } else {
      // Remove stock if no shares left
      await prisma.stock.delete({
        where: { id: existingStock.id }
      });
    }
  } else {
    throw new Error("Invalid trade type. Must be 'buy' or 'sell'");
  }
  
return { success: true };
}