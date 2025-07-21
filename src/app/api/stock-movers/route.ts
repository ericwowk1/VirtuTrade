import { NextResponse } from 'next/server';

const apiKey = process.env.ALPACA_API_KEY;
const apiSecret = process.env.ALPACA_API_SECRET;

export async function GET() {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': apiKey!,
        'APCA-API-SECRET-KEY': apiSecret!
      }
    };

    const response = await fetch('https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=15', options);
    
    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching stock movers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movers' },
      { status: 500 }
    );
  }
}