import { NextResponse } from 'next/server';
import axios from 'axios';

// This function handles GET requests to /api/news
export async function GET() {
  const apiKey = process.env.ALPACA_API_KEY;
  const apiSecret = process.env.ALPACA_API_SECRET;

  // Ensure API keys are available
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "API credentials are not configured in .env.local" },
      { status: 500 }
    );
  }



  try {
    const response = await axios.get(
      `https://data.alpaca.markets/v1beta1/news?sort=desc&limit=4`,
      {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': apiSecret,
        }
      }
    );

  
    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Error fetching from Alpaca API:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}