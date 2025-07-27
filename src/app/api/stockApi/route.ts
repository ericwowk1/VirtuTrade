import { NextRequest } from "next/server";
import { getStockData } from "@/services/getStockData"
import { getStockInfo } from "@/services/getStockInfo"
import { getCachedLogo, cacheLogo } from "@/services/logoCache";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      const priceOnly = searchParams.get('priceOnly') === 'true'; 
      
      if (!ticker) {
         return Response.json({ error: "no ticker at stockApi route" }, { status: 400 });
      }

      // Always get stock data
      const stockData = await getStockData(ticker);

      // Only get stock info if priceOnly is not true
      let logo = null;
      let name = null;
      let stockInfo = null;

      if (!priceOnly) {
         // Check if logo is already cached first
         const cachedLogoPath = await getCachedLogo(ticker);
         stockInfo = await getStockInfo(ticker); // Store the full stockInfo

         // Handle logo caching
         logo = cachedLogoPath;
         name = (stockInfo as any)?.name || null;

         // If logo not cached, try to cache it
         if (!cachedLogoPath && (stockInfo as any)?.logo) {
            try {
               const cachedPath = await cacheLogo(ticker, (stockInfo as any).logo);
               logo = cachedPath || (stockInfo as any).logo;
            } catch (err) {
               console.error(`Error caching logo for ${ticker}:`, err);
               logo = (stockInfo as any)?.logo || null;
            }
         }
      }

      const result = {
         ticker,
         c: stockData.c,
         pc: stockData.pc,
         d: stockData.d,
         dp: stockData.dp,
         logo,
         name,
         stockInfo // Include the full stockInfo object
      };
      
      console.log("result stockapi", result);

      return Response.json(result);
   }
   catch (error) {
      console.log("error at stockApi route", error);
      return Response.json({ error: "Failed to fetch data at stockApi route" }, { status: 500 });
   }
}