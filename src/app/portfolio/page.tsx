import React from 'react';
import { getBalance } from '@/services/getBalance';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { redirect } from "next/navigation";
import { AccountDetails } from "@/app/components/AccountDetails";
import { PortfolioPieChart } from "@/app/components/PortfolioPieChart";
import { StockPositionsTable } from "@/app/components/StockPositionsTable";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const balance = await getBalance(session.user.id);

  return (
    <div>
      

      <div className="grid grid-cols-2 gap-6 mb-8 py-12">
        <AccountDetails userId={session.user.id} />
        <PortfolioPieChart />
      </div>

      <StockPositionsTable userId={session.user.id} />
    </div>
  );
}