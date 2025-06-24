import { NextRequest } from "next/server";
import { getStockData } from "@/services/getStockData"
import { getStockInfo } from "@/services/getStockInfo"
import { getCachedLogo, cacheLogo } from "@/services/logoCache";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      console.log("ticker", ticker);
      
      if (!ticker) {
         return Response.json({ error: "no ticker at stockApi route" }, { status: 400 });
      }

      // Check if logo is already cached first
      const cachedLogoPath = await getCachedLogo(ticker);

      // Call both functions in parallel
      const [stockData, stockInfo] = await Promise.all([
         getStockData(ticker),
         getStockInfo(ticker)
      ]);

      // Handle logo caching
      let logo = cachedLogoPath;
      let name = (stockInfo as any)?.name || null;

      // If logo not cached, try to cache it
      if (!cachedLogoPath && (stockInfo as any)?.logo) {
         try {
            const cachedPath = await cacheLogo(ticker, (stockInfo as any).logo);
            logo = cachedPath || (stockInfo as any).logo; // Use cached path or fallback to original URL
         } catch (err) {
            console.error(`Error caching logo for ${ticker}:`, err);
            logo = (stockInfo as any)?.logo || null;
         }
      }

      // Return flat object with all values
      const result = {
         ticker,
         c: stockData.c,
         pc: stockData.pc,
         d: stockData.d,
         dp: stockData.dp,
         logo,
         name,
         timestamp: new Date().toISOString()
      };

      return Response.json(result);
   }
   catch (error) {
      console.log("error at stockApi route", error);
      return Response.json({ error: "Failed to fetch data at stockApi route" }, { status: 500 });
   }
}
