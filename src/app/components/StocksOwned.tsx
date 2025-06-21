import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { prisma } from "@/services/prisma";



interface AccountDetailsProps {
   userId: string;
 }

 export async function StocksOwned({ userId }: AccountDetailsProps) {
   const session = await getServerSession(authOptions);
   const stocks = await prisma.stock.findMany({
      where: { userId },
      orderBy: { symbol: 'asc' }
    });

   return (
<div className="bg-white rounded-lg shadow-lg p-6">
<h1>Stocks Owned</h1>
<h1>Last Price</h1>

</div>


   )
};