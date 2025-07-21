// app/api/positions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";
import { prisma } from "@/services/prisma";
import { getStockHistory } from "@/services/getStockHistory";
import { getStockData } from "@/services/getStockData";
import { getStockInfo } from "@/services/getStockInfo";
import { getCachedLogo, cacheLogo } from "@/services/logoCache";



// Add type definition for company info
interface CompanyInfo {
  logo?: string;
  name?: string;
  [key: string]: any; // Allow other properties from the API
}

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

    const stocks = await prisma.stock.findMany({
      where: { userId },
      select: {
        symbol: true,
        quantity: true,
        averagePrice: true
      }
    });

    // Fetch real-time data, historical data AND company info for each stock
    const stocksWithHistory = await Promise.all(
      stocks.map(async (stock) => {
        try {
          console.log(`Server: Fetching data for ${stock.symbol}...`);
          
          // Get real-time data, historical data and check logo cache in parallel
          const [stockData, chartData, cachedLogoPath] = await Promise.all([
            getStockData(stock.symbol),
            getStockHistory(stock.symbol, '1D'),
            getCachedLogo(stock.symbol)
          ]);
          
          const historicalPrices = chartData.map(point => point.value);
          
          // Use real-time data from Alpaca API
          const currentPrice = stockData.c;
          const change = currentPrice - stockData.pc; // Current price - previous close
          const changePercent = stockData.dp; // Pre-calculated daily percent change
          
          let logo = cachedLogoPath;
          let name = stock.symbol;
          
          // If logo not cached, fetch from API
          if (!cachedLogoPath) {
            try {
              const companyInfo = await getStockInfo(stock.symbol) as CompanyInfo;
              if (companyInfo?.logo) {
                // Try to cache the logo
                const cachedPath = await cacheLogo(stock.symbol, companyInfo.logo);
                logo = cachedPath || companyInfo.logo; // Use cached path or fallback to original URL
              }
              name = companyInfo?.name || stock.symbol;
            } catch (err) {
              console.error(`Error fetching company info for ${stock.symbol}:`, err);
            }
          } else {
            console.log(`Logo cached, skipping ${stock.symbol}`);
          }
          
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            historicalPrices: historicalPrices,
            currentPrice,
            change,
            changePercent,
            logo,
            name
          };
          
        } catch (error) {
          console.error(`Server: Error fetching data for ${stock.symbol}:`, error);
          
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            averagePrice: stock.averagePrice,
            historicalPrices: [],
            currentPrice: stock.averagePrice,
            change: 0,
            changePercent: 0,
            logo: null,
            name: stock.symbol
          };
        }
      })
    );

    return NextResponse.json({ stocks: stocksWithHistory });

  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}