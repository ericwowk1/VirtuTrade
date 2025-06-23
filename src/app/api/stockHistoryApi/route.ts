import { NextRequest } from "next/server";
import { getStockHistory, TimeRange } from "@/services/getStockHistory";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      const timeRange = searchParams.get('timeRange') as TimeRange || '1M';
      
      if (!ticker) {
         return Response.json({ error: "No ticker provided" }, { status: 400 });
      }


      const result = await getStockHistory(ticker, timeRange);
      console.log("Stock history result count:", result);

         
      return Response.json({ 
         values: result,
         ticker,
         timeRange,
         count: result.length 
      });
   }
   catch (error) {
      console.error("Error at stockHistoryApi route:", error);
      return Response.json({ 
         error: "Failed to fetch data", 
         details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
   }
}