import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { PortfolioPieChart } from "@/app/components/PortfolioPieChart";
import { StockPositionsTable } from "@/app/components/StockPositionsTable";
import Link from "next/link";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/60 rounded-lg border border-slate-700 p-6">
            <div className="border-b-2 border-white w-full mb-6">
              <h2 className="text-2xl text-white mb-3">Portfolio</h2>
            </div>
            <div className="bg-[#0F172A] rounded-lg p-8 text-center">
              <p className="text-white font-medium mb-2">Your portfolio is empty</p>
              <p className="text-gray-400 text-sm mb-6">
                Sign in and search for stocks to start building your portfolio
              </p>
              <Link 
                href="/api/auth/signin"
                className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
        <div className="w-full">
          <PortfolioPieChart />
        </div>
        <div className="w-full">
          <StockPositionsTable userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}