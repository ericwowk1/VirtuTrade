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