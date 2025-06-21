import { NextRequest } from "next/server";
import { getStockHistory } from "@/services/getStockHistory"


export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      
      
      if (!ticker) {
         return Response.json({ error: "no ticker at stockhistory route" }, { status: 400 });
      }

      // Call both functions in parallel
      const result = await getStockHistory(ticker);
      console.log("stock history result", result)
         

      return Response.json(result);
   }
   catch (error) {
      console.log("error at stockhistoryApi route", error);
      return Response.json({ error: "Failed to fetch data at stockhistoryApi route" }, { status: 500 });
   }
}
