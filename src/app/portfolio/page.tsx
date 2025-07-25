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
    <div>
      

      <div className="grid grid-cols-2 gap-[2rem] py-[2rem] ">
        <div className="pl-[2rem] ">
        <PortfolioPieChart />
</div>
<div className="pr-[2rem] ">
        <StockPositionsTable userId={session.user.id} />
        </div>
      </div>

      
    </div>
  );
}