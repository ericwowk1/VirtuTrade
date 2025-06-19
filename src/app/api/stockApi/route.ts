import { NextRequest } from "next/server";
import { getStockData } from "@/services/getStockData"

export async function GET(request: NextRequest) {

   try {
      const { searchParams } = new URL(request.url);
      const ticker = searchParams.get('ticker');
      console.log("ticker", ticker);
      if (!ticker) {
         return Response.json({ error: "no ticker at stockApi route" }, { status: 400 });
       }

       const result = await getStockData(ticker);
       return Response.json(result);
   }
   catch (error) {
      console.log("error at stockApi route");
      return Response.json({ error: "Failed to fetch data at stockApi route" }, { status: 500 });
   }

   

}
