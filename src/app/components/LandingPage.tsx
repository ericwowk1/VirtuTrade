import Link from 'next/link'

export function LandingPage() {
   return (
      <div className="flex flex-col">
         
         {/* part 1 */}
         <div className="flex flex-row items-center py-30 px-20">
            {/* Left side - content */}
            <div className="flex flex-col flex-1 ">
               <h1 className="text-7xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent pb-6 font-roboto">Master the Art of Stock Trading!</h1>
               <h1 className="text-6xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent pb-6 font-roboto">With ZERO Risk.</h1>
               
               <p className="text-xl text-gray-400 pb-6 font-roboto max-w-3xl">
                  Master the markets without losing a dime. Get real trading experience with virtual risk.
               </p>
               
               <div className="flex flex-row   space-x-12">
                  <Link href="/signup" className="bg-[#155dfc]  text-white px-20 py-4 rounded-md">
                     Try For Free!
                  </Link>
                  
                  <Link href="/signup" className="bg-[#45556c] text-white px-20 py-4 rounded-md">
                     Learn More
                  </Link>
               </div>
            </div>
            
            {/* Right side - image */}
           {/* Right side - image */}
         <div className="flex-1 flex  ">
         <img className="h-200 w-full object-contain -ml-40 animate-float" src="/homepagepicture.png" alt="Trading interface" />
         </div>
         </div>
      </div>
   )
}
