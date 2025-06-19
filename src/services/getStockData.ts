const finnhub = require('finnhub');

console.log("getstockdata ran")
let count = 0;

// Initialize once
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

export async function getStockData(ticker: string) {
  console.log('Fetching data for ticker:', ticker); // Add this line
  count = count + 1;
  console.log("count", count)
  
  return new Promise((resolve, reject) => {
    finnhubClient.quote(ticker, (error, data) => {
      console.log('Finnhub callback executed'); // Add this line
      if (error) {
        console.error("Finnhub Error:", error);
        reject(error);
      } else {
        console.log("Finnhub Data:", data);
        resolve(data);
      }
    });
  });
}
