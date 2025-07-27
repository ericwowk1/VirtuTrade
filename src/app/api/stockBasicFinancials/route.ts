import { NextRequest } from "next/server";
import { getStockBasicFinancials } from "@/services/getstockbasicfinancials";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    
    if (!ticker) {
      return Response.json({ error: "No ticker provided" }, { status: 400 });
    }

    const basicFinancials = await getStockBasicFinancials(ticker);
    
    console.log("Basic financials result:", basicFinancials);
    
    return Response.json(basicFinancials);
  } catch (error) {
    console.error("Error at stockBasicFinancials route:", error);
    return Response.json({ error: "Failed to fetch basic financials" }, { status: 500 });
  }
}