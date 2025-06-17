import React from 'react';
import { getBalance} from '@/lib/getBalance'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountDetails } from "@/app/components/AccountDetails";
import { StocksOwned } from "@/app/components/StocksOwned";

export default async function PortfolioPage() {

  const session = await getServerSession(authOptions);
  console.log("session", session)
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }


  const balance = await getBalance(session.user.id);



  return (
    <div className="grid grid-cols-2 gap-6">
      <AccountDetails userId={session.user.id} />
      <StocksOwned userId={session.user.id} />
      <h1>Balance</h1>
      <h1>${balance}</h1>
      
    </div>
  );
}