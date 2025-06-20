import { NextRequest } from "next/server";
import { getStockData, getStockInfo } from "@/services/getStockData"


export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      console.log("ticker", ticker);
      
      if (!ticker) {
         return Response.json({ error: "no ticker at stockApi route" }, { status: 400 });
      }

      // Call both functions in parallel
      const [stockData, stockInfo] = await Promise.all([
         getStockData(ticker),
         getStockInfo(ticker)
      ]);

      // Combine the results
      const combinedResult = {
         ticker,
         data: stockData,
         info: stockInfo,
         timestamp: new Date().toISOString()
      };

      return Response.json(combinedResult);
   }
   catch (error) {
      console.log("error at stockApi route", error);
      return Response.json({ error: "Failed to fetch data at stockApi route" }, { status: 500 });
   }
}
