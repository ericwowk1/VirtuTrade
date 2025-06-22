// app/api/executeTradeApi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { executeTrade } from "@/services/executeTrade";

export async function POST(request: NextRequest) {
  try {
   
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" }, 
        { status: 401 }
      );
    }
    
    const { ticker, shares, price, type } = await request.json();
    
    // ... validation code ...
    
    const result = await executeTrade({
      userId: session.user.id,
      ticker,
      shares: parseInt(shares.toString(), 10),
      price: parseFloat(price.toString()),
      type
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${type === 'buy' ? 'purchased' : 'sold'} ${shares} shares of ${ticker}`,
      data: result
    });
    
  } catch (error) {
   
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, { status: 500 });
  }
}