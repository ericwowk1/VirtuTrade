interface Mover {
  symbol: string;
  percent_change: number;
  change: number;
  price: number;
}

interface MoversResponse {
  gainers: Mover[];
  losers: Mover[];
  market_type: string;
  last_updated: string;
}
const apiKey = process.env.ALPACA_API_KEY;
  const apiSecret = process.env.ALPACA_API_SECRET;

export async function TopStockMovers() {
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
    return <div className="text-red-400">Failed to load market movers</div>;
  }

  const movers: MoversResponse = await response.json();
  const topGainers = movers.gainers.slice(0, 5);
  const topLosers = movers.losers.slice(0, 5);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;
  const formatChange = (change: number) => `$${Math.abs(change).toFixed(2)}`;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Top Market Movers</h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date(movers.last_updated).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Top Gainers
          </h3>
          <div className="space-y-3">
            {topGainers.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div className="text-xs text-gray-400 w-6 mr-3">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{formatPrice(stock.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">
                    +{formatPercent(stock.percent_change)}
                  </div>
                  <div className="text-sm text-green-400">
                    +{formatChange(stock.change)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
            Top Losers
          </h3>
          <div className="space-y-3">
            {topLosers.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div className="text-xs text-gray-400 w-6 mr-3">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{formatPrice(stock.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium">
                    {formatPercent(stock.percent_change)}
                  </div>
                  <div className="text-sm text-red-400">
                    -{formatChange(stock.change)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}