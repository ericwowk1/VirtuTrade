// Finnhub configuration for company info
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

export async function getStockInfo(ticker: string) {
  console.log('Fetching company info for ticker:', ticker);
  
  return new Promise((resolve, reject) => {
    finnhubClient.companyProfile2({'symbol': `${ticker}`}, (error: any, data: any, response: any) => {
      if (error) {
        console.error("Finnhub Error:", error);
        reject(error);
      } else {
        console.log("Company Profile", data);
        resolve(data);
      }
    });
  });
}
