import React from 'react';
import { prisma } from '@/services/prisma';
import { getStockData } from '@/services/getStockData';
import { authOptions } from "@/services/auth";
import { getServerSession } from "next-auth/next";
import { TrendingUp, DollarSign, Wallet, Trophy, Medal, Award } from "lucide-react";

interface StockData {
 c: number; // current price
 pc: number; // previous close
 dp: number; // daily percent change
 // Add other properties as needed
}

export default async function Leaderboard() {
 const session = await getServerSession(authOptions);

 // Get current user's balance and rank
 const getCurrentUserData = async () => {
   try {
     const currentUser = await prisma.user.findUnique({
       where: {
         id: session.user.id,
       },
       select: {
         id: true,
         name: true,
         email: true,
         image: true,
         money: true,
         stocks: {
           select: {
             symbol: true,
             quantity: true,
             averagePrice: true,
           }
         }
       }
     });

     if (!currentUser) {
       return null;
     }

     // Calculate current stock value
     let stockValue = 0;
     for (const stock of currentUser.stocks) {
       try {
         const stockData = await getStockData(stock.symbol) as StockData;
         const currentPrice = stockData.c;
         stockValue += currentPrice * stock.quantity;
       } catch (error) {
         console.error(`Error fetching ${stock.symbol}:`, error);
         stockValue += stock.averagePrice * stock.quantity;
       }
     }

     const totalPortfolioValue = (currentUser.money || 0) + stockValue;

     // Get all users to calculate rank
     const allUsers = await prisma.user.findMany({
       select: {
         id: true,
         money: true,
         stocks: {
           select: {
             symbol: true,
             quantity: true,
             averagePrice: true,
           }
         }
       }
     });

     // Calculate portfolio values for all users and sort
     const userPortfolios = await Promise.all(
       allUsers.map(async (user) => {
         let userStockValue = 0;
         for (const stock of user.stocks) {
           try {
             const stockData = await getStockData(stock.symbol) as StockData;
             userStockValue += stockData.c * stock.quantity;
           } catch (error) {
             userStockValue += stock.averagePrice * stock.quantity;
           }
         }
         return {
           id: user.id,
           totalValue: (user.money || 0) + userStockValue
         };
       })
     );

     const sortedUsers = userPortfolios.sort((a, b) => b.totalValue - a.totalValue);
     const userRank = sortedUsers.findIndex(user => user.id === currentUser.id) + 1;

     return {
       name: currentUser.name || 'Anonymous',
       image: currentUser.image,
       cash: currentUser.money || 0,
       stockValue: stockValue,
       totalValue: totalPortfolioValue,
       rank: userRank
     };
   } catch (error) {
     console.error('Error fetching current user data:', error);
     return null;
   }
 };

 const getTopUsers = async () => {
   try {
     // Get users with their stocks
     const users = await prisma.user.findMany({
       select: {
         id: true,
         name: true,
         email: true,
         image: true,
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
           image: user.image,
           cash: user.money || 0,
           stockValue: stockValue,
           totalValue: totalPortfolioValue,
         };
       })
     );

    // Sort by total portfolio value
    const sortedUsers = usersWithPortfolioValue.sort((a, b) => b.totalValue - a.totalValue);

     return sortedUsers.map((user, index) => ({
       rank: index + 1,
       name: user.name,
       image: user.image,
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

 const [currentUserData, leaderboardData] = await Promise.all([
   session?.user?.id ? getCurrentUserData() : Promise.resolve(null),
   getTopUsers()
 ]);

 const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
     minimumFractionDigits: 0,
     maximumFractionDigits: 0,
   }).format(amount);
 };

 const getRankIcon = (rank: number) => {
  console.log( "rank",rank);
   switch (rank) {
     case 1:
       return <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />;
     case 2:
       return <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />;
     case 3:
       return <Award className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />;
     default:
       return <span className="text-sm font-semibold text-white">#{rank}</span>;
   }
 };

 const ProfilePicture = ({ name, image, size = "w-10 h-10 sm:w-12 sm:h-12" }: { 
   name: string; 
   image?: string | null; 
   size?: string;
 }) => {
   if (image) {
     return (
       <img
         src={image}
         alt={`${name}'s profile`}
         className={`${size} rounded-full border-2 border-slate-600 object-cover`}
       />
     );
   }
   
   // Fallback to initials if no image
   const initials = name
     .split(" ")
     .map((n) => n[0])
     .join("")
     .toUpperCase();
     
   return (
      <div className={`${size} bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-600`}>
       <span className="text-white font-semibold text-xs sm:text-sm">
         {initials}
       </span>
     </div>
   );
 };

 return (
   <div className="min-h-screen p-4 sm:p-6 lg:px-44 xl:px-66">
     <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
       
       {/* User Stats Card */}
       {currentUserData && (
         <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 sm:p-6">
           <div className="border-b-2 border-white w-full mb-4">
             <h3 className="text-xl text-white mb-3">Your Stats</h3>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             <div className="bg-[#0F172A] rounded-lg p-4">
               <p className="text-gray-400 text-xs sm:text-sm">Your Rank</p>
               <p className="text-xl sm:text-2xl font-bold text-amber-400">#{currentUserData.rank}</p>
             </div>
             <div className="bg-[#0F172A] rounded-lg p-4">
               <p className="text-gray-400 text-xs sm:text-sm">Portfolio Value</p>
               <p className="text-xl sm:text-2xl font-bold text-emerald-400">{formatCurrency(currentUserData.totalValue)}</p>
             </div>
             <div className="bg-[#0F172A] rounded-lg p-4 col-span-2 sm:col-span-1">
               <div className="flex items-center gap-3">
                 <ProfilePicture 
                   name={currentUserData.name} 
                   image={currentUserData.image}
                   size="w-10 h-10"
                 />
                 <div>
                   <p className="text-gray-400 text-xs">Logged in as</p>
                   <p className="font-medium text-white text-sm">{currentUserData.name}</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Leaderboard */}
       <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 sm:p-6">
         <div className="border-b-2 border-white w-full mb-4">
           <h3 className="text-xl text-white mb-3">Leaderboard</h3>
         </div>
         
         {leaderboardData.length === 0 ? (
           <div className="bg-[#0F172A] rounded-lg p-8 text-center">
             <p className="text-gray-400">No users found</p>
             <p className="text-gray-500 text-sm">Be the first to start trading!</p>
           </div>
         ) : (
           <div className="space-y-2">
             {/* Header row */}
             <div className="grid grid-cols-[auto_1fr_auto] gap-3 px-3 py-2 text-xs text-gray-400">
               <div className="w-8">Rank</div>
               <div>Trader</div>
               <div className="text-right">Portfolio Value</div>
             </div>
             
             {/* User rows */}
             <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
               {leaderboardData.map((user) => (
                 <div
                   key={user.id}
                   className="grid grid-cols-[auto_1fr_auto] gap-3 items-center p-3 rounded-lg bg-[#0F172A] hover:bg-slate-700/50 transition-colors"
                 >
                   <div className="w-8 flex items-center justify-center">
                     {user.rank <= 3 ? (
                       getRankIcon(user.rank)
                     ) : (
                       <span className="text-sm text-gray-400">#{user.rank}</span>
                     )}
                   </div>
                   <div className="flex items-center gap-3 min-w-0">
                     <ProfilePicture 
                       name={user.name} 
                       image={user.image}
                       size="w-9 h-9"
                     />
                     <span className="font-medium text-white text-sm truncate">{user.name}</span>
                   </div>
                   <div className="text-right">
                     <span className={`font-semibold text-sm ${
                       user.rank === 1 ? 'text-yellow-400' : 
                       user.rank === 2 ? 'text-gray-300' : 
                       user.rank === 3 ? 'text-amber-500' : 'text-white'
                     }`}>
                       {formatCurrency(user.totalValue)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}