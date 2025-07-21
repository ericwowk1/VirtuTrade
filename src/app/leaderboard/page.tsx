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
   switch (rank) {
     case 1:
       return <Trophy className="h-5 w-5 text-yellow-400" />;
     case 2:
       return <Medal className="h-5 w-5 text-gray-300" />;
     case 3:
       return <Award className="h-5 w-5 text-amber-500" />;
     default:
       return <span className="text-sm font-semibold text-slate-400">#{rank}</span>;
   }
 };

 const ProfilePicture = ({ name, image, size = "w-12 h-12" }: { 
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
       <span className="text-white font-semibold text-sm">
         {initials}
       </span>
     </div>
   );
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-6">
     <div className="max-w-6xl mx-auto space-y-6">
       
       {/* User Stats Card */}
       {currentUserData && (
         <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-8">
               <div className="flex items-center space-x-3">
                 <div className="bg-amber-500 rounded-full p-3">
                   <Trophy className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <p className="text-slate-400 text-sm font-medium">Your Rank</p>
                   <p className="text-3xl font-bold text-amber-400">#{currentUserData.rank}</p>
                 </div>
               </div>

               <div className="h-12 w-px bg-slate-600"></div>

               <div className="flex items-center space-x-3">
                 <div className="bg-emerald-500 rounded-full p-3">
                   <TrendingUp className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <p className="text-slate-400 text-sm font-medium">Portfolio Value</p>
                   <p className="text-3xl font-bold text-emerald-400">{formatCurrency(currentUserData.totalValue)}</p>
                 </div>
               </div>
             </div>

             <div className="flex items-center space-x-3">
               <ProfilePicture 
                 name={currentUserData.name} 
                 image={currentUserData.image}
               />
               <div>
                 <p className="font-semibold text-white">{currentUserData.name}</p>
                 <p className="text-slate-400 text-sm">Investor</p>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Leaderboard */}
       <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg">
         <div className="p-6 pb-2">
           <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
             <Trophy className="h-5 w-5 text-yellow-400" />
             Leaderboard
           </h3>
         </div>
         <div className="p-6 pt-3 space-y-3">
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
                 className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                   user.rank <= 3
                     ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-600/30"
                     : "bg-slate-700/50 hover:bg-slate-700/70"
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-8 h-8">{getRankIcon(user.rank)}</div>
                   <ProfilePicture 
                     name={user.name} 
                     image={user.image}
                     size="h-10 w-10"
                   />
                   <div>
                     <p className="font-semibold text-white">{user.name}</p>
                     
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-lg text-white">{formatCurrency(user.totalValue)}</p>
                   
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
     </div>
   </div>
 );
}