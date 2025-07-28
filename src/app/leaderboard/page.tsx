import React from 'react';
import { prisma } from '@/services/prisma';
import { getStockData } from '@/services/getStockData';
import { authOptions } from "@/services/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { TrendingUp, DollarSign, Wallet, Trophy, Medal, Award } from "lucide-react";

interface StockData {
 c: number; // current price
 pc: number; // previous close
 dp: number; // daily percent change
 // Add other properties as needed
}

export default async function Leaderboard() {
 const session = await getServerSession(authOptions);
 
 if (!session || !session.user?.id) {
   redirect('/'); // or wherever your login page is
 }

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

     // Sort by total portfolio value and get top 5
     const sortedUsers = usersWithPortfolioValue.sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

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
   getCurrentUserData(),
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
   <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:px-44 xl:px-66">
     <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
       
       {/* User Stats Card */}
       {currentUserData && (
         <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 gap-4 sm:gap-0">
               <div className="flex items-center space-x-3">
                 <div className="bg-amber-500 rounded-full p-2 sm:p-3 ">
                   <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs sm:text-sm font-medium">Your Rank</p>
                   <p className="text-2xl sm:text-3xl font-bold text-amber-400">#{currentUserData.rank}</p>
                 </div>
               </div>

               <div className="hidden sm:block h-12 w-px bg-slate-600"></div>

               <div className="flex items-center space-x-3">
                 <div className="bg-emerald-500 rounded-full p-2 sm:p-3">
                   <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs sm:text-sm font-medium">Portfolio Value</p>
                   <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{formatCurrency(currentUserData.totalValue)}</p>
                 </div>
               </div>
             </div>

             <div className="flex items-center space-x-3 self-start sm:self-auto">
               <ProfilePicture 
                 name={currentUserData.name} 
                 image={currentUserData.image}
               />
               <div>
                 <p className="font-semibold text-white text-sm sm:text-base">{currentUserData.name}</p>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Leaderboard */}
       <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg">
         <div className="p-4 sm:p-6 pb-2 sm:pb-2">
           <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-white">
             <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
             Leaderboard
           </h3>
         </div>
         <div className="p-4 sm:p-6 pt-3 max-h-[32rem] sm:max-h-[42rem] overflow-y-auto custom-scrollbar">
           <div className="space-y-2 sm:space-y-3">
             {leaderboardData.length === 0 ? (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Trophy className="h-8 w-8 text-slate-400" />
                 </div>
                 <p className="text-slate-400 text-lg">No users found</p>
                 <p className="text-slate-500 text-sm">Be the first to start trading!</p>
               </div>
             ) : (
               leaderboardData.map((user) => (
                 <div
                   key={user.id}
                   className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${
                     user.rank == 1
                       ? "bg-gradient-to-r from-yellow-400/70 to-amber-700/20"
                       : user.rank == 2
                       ? "bg-gradient-to-r from-gray-200/80 to-amber-700/20"
                       : user.rank == 3
                       ? "bg-gradient-to-r from-amber-800/80 to-amber-700/20"
                       : "bg-[#0F172A]"
                   }`}
                 >
                   <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">{getRankIcon(user.rank)}</div>
                     <ProfilePicture 
                       name={user.name} 
                       image={user.image}
                       size="h-10 w-10 sm:h-13 sm:w-13"
                     />
                     <div>
                       <p className="font-semibold text-white text-sm sm:text-base">{user.name}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-base sm:text-lg text-white">{formatCurrency(user.totalValue)}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}