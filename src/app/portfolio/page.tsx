import React from 'react';
import { getBalance } from '@/services/getBalance';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { redirect } from "next/navigation";
import { PortfolioPieChart } from "@/app/components/PortfolioPieChart";
import { StockPositionsTable } from "@/app/components/StockPositionsTable";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
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