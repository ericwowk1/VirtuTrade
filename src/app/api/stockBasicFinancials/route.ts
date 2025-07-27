import { NextRequest } from "next/server";

// Finnhub configuration for basic financials
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

export async function getStockBasicFinancials(ticker: string) {
  console.log('Fetching basic financials for ticker:', ticker);
  
  return new Promise((resolve, reject) => {
    finnhubClient.companyBasicFinancials(ticker, 'all', (error: any, data: any, response: any) => {
      if (error) {
        console.error("Finnhub Basic Financials Error:", error);
        reject(error);
      } else {
        console.log("Basic Financials Data:", data);
        resolve(data);
      }
    });
  });
}

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