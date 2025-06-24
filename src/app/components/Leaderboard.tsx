import React from 'react';
import { prisma } from '@/services/prisma';
import { getStockData } from '@/services/getStockData';

interface StockData {
  c: number; // current price
  pc: number; // previous close
  dp: number; // daily percent change
  // Add other properties as needed
}

export async function Leaderboard() {
  const getTopUsers = async () => {
    try {
      // Get users with their stocks
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          money: true,
          stocks: {
            select: {
              symbol: true,
              quantity: true,
              averagePrice: true,
            }
          }
        },
        orderBy: {
          money: 'desc'
        }
      });

      // Calculate total portfolio value for each user
      const usersWithPortfolioValue = await Promise.all(
        users.map(async (user) => {
          let stockValue = 0;

          // Calculate current value of all stock holdings
          for (const stock of user.stocks) {
            try {
              const stockData = await getStockData(stock.symbol) as StockData;
              const currentPrice = stockData.c; // Current price
              stockValue += currentPrice * stock.quantity;
            } catch (error) {
              console.error(`Error fetching ${stock.symbol}:`, error);
              // Fallback to average price if API fails
              stockValue += stock.averagePrice * stock.quantity;
            }
          }

          const totalPortfolioValue = (user.money || 0) + stockValue;

          return {
            id: user.id,
            name: user.name || 'Anonymous',
            cash: user.money || 0,
            stockValue: stockValue,
            totalValue: totalPortfolioValue,
          };
        })
      );

      // Sort by total portfolio value and get top 5
      const sortedUsers = usersWithPortfolioValue.sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

      return sortedUsers.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        cash: user.cash,
        stockValue: user.stockValue,
        totalValue: user.totalValue,
        id: user.id
      }));

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  };

  const leaderboardData = await getTopUsers();

  const formatBalance = (balance:any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  const badges = ['🥇', '🥈', '🥉'];

return (
  <div className="bg-gray-900 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
      🏆 Leaderboard
    </h3>
    <div className="space-y-3">
      {leaderboardData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-white/60">No users found</p>
        </div>
      ) : (
        leaderboardData.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-3 rounded ${
              user.rank <= 3 
                ? 'bg-gradient-to-r from-purple-100/20 to-purple-50/20 border-l-4 border-purple-400' 
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-white">
                {user.rank <= 3 ? badges[user.rank - 1] : user.rank}
              </span>
              <div>
                <p className="font-bold text-white text-xl">
                  {user.name} - {formatBalance(user.totalValue)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}