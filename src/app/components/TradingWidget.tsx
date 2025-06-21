import { prisma } from "@/services/prisma";
import { GetBalance } from "@/app/components/GetBalance"

interface TradingWidgetProps {
   ticker: string;
   currentPrice: number;
 }

export function TradingWidget({ ticker, currentPrice }: TradingWidgetProps) {

   return (   
     <div className="flex flex-col p-6 bg-gray-800 rounded-lg mr-8 w-150 h-210">
       {/* Header Tabs */}
       <div className="flex flex-row mb-6 border-b border-gray-600">
         <button className="text-white pb-6 py-6 mr-6 border-b-2 border-teal-500 text-2xl font-bold">
           Buy {ticker}
         </button>
         
       </div>

       {/* Order Type */}
       <div className="mb-8">
  <label className="block text-gray-300 text-xl mb-4">Order Type</label>
  <select 
    id="orderType"
    className="w-full bg-gray-700 text-white p-2 mb-4 rounded border border-gray-600 focus:border-teal-500"
  >
    <option value="Market">Market</option>
    
  </select>
  
  
  
</div>

       {/* Buy Shares */}
       <div className="mb-4">
         <label className="block text-gray-300 text-xl mb-4">Buy Shares</label>
         <input 
           type="number" 
           defaultValue="0"
           className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-500"
         />
       </div>

       {/* Estimated Cost */}
       <div className="mb-6">
         <div className="flex justify-between text-gray-300 text-3xl mb-12 py-6">
           <span>Estimated Cost</span>
           <span>$0</span>
         </div>
       </div>

       {/* Buy Button */}
       <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md font-medium mb-4">
         Buy
       </button>

       {/* Available Funds */}
       <div className="text-center text-green-400 text-2xl py-6 mb-4">
         <GetBalance />
       </div>

       
       <div className="py-24 text-sm">
       <h4>Stocks Prices do not update frequently and can be innacurate due to free API limits </h4>
       
      </div>
       
     </div>
   );
}