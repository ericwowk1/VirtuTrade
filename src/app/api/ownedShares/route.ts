import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { prisma } from "@/services/prisma";



export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get ticker from query params
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    
    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker symbol is required" }, 
        { status: 400 }
      );
    }

    // Query for the specific stock
    const stock = await prisma.stock.findFirst({
      where: { 
        userId,
        symbol: ticker.toUpperCase()
      },
      select: {
        quantity: true,
        averagePrice: true
      }
    });

    // Return 0 if user doesn't own this stock
    const ownedShares = stock?.quantity || 0;

    return NextResponse.json({
      ticker: ticker.toUpperCase(),
      ownedShares,
      averagePrice: stock?.averagePrice || 0
    });

  } catch (error) {
    console.error("Error fetching owned shares:", error);
    return NextResponse.json(
      { error: "Failed to fetch owned shares" }, 
      { status: 500 }
    );
  }
}