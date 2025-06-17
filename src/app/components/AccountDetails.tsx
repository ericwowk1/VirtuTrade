// components/portfolio/AccountDetails.tsx
import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/services/prisma";


interface AccountDetailsComponentProps {
  userId: string;
}

export async function AccountDetails({ userId }: AccountDetailsComponentProps) {
  const session = await getServerSession(authOptions);
  
  // Get user data including money from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { money: true, email: true }
  });

  const balance = user?.money || 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b">Account Details</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-300">
          <span className="text-gray-600">Buying Power:</span>
          <span className="font-medium">${balance.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-300">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium">{session?.user?.email || user?.email}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-300">
          <span className="text-gray-600">Account Type:</span>
          <span className="font-medium text-green-600">Paper Trading</span>
        </div>
      </div>
    </div>
  );
}