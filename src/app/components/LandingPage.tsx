export function LandingPage() {
  return (
   <div>
      {/* Hero container */}
      <div className="w-screen h-[90vh] relative">
        
        {/* Background layer with mask */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/tech.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 45%, transparent 100%)'
          }}
        />
        
        {/* Content layer - unaffected by mask */}
        <div className="relative  flex flex-col h-full">
          <div className="flex flex-row items-center px-20 flex-1 mb-[10rem]">
            {/* Left side - content */}
            <div className="flex flex-col flex-1">
               <h1 className="text-6xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent pb-6 font-roboto">Master the Art of Stock Trading!</h1>
               <h1 className="text-5xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent pb-6 font-roboto">With ZERO Risk.</h1>
               <p className="text-xl text-gray-300 pb-6 font-roboto max-w-3xl">
                  Master the markets without losing a dime. Get real trading experience with virtual risk.
               </p>
               
            </div>
            {/* Right side - image */}
            <div className="flex-1.5 flex mr-[18rem] ">
              <img className="h-130 object-contain animate-float" src="/homepagepicture.png" alt="Trading interface" />
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <a 
              href="#learn-more-section"
              className="text-white text-lg mb-2 font-roboto block"
            >
              Click to learn more
            </a>   
            <a 
              href="#learn-more-section"
              className="cursor-pointer hover:scale-110 transition-transform duration-200 animate-bounce inline-block"
              aria-label="Scroll to learn more"
            >
              <img src="/arrow.svg" alt="Scroll down arrow" className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
      
  {/* New section that the arrow scrolls to */}
      <div id="learn-more-section" className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto pt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-roboto">
            Learn More About Our Platform
          </h2>
          <p className="text-lg text-gray-600 text-center font-roboto mb-8">
            This is your new section content. Add whatever information you want users to see when they click the arrow.
          </p>
          
          {/* You can add more content here */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-roboto">Feature 1</h3>
              <p className="text-gray-600 font-roboto">Add your feature description here.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-roboto">Feature 2</h3>
              <p className="text-gray-600 font-roboto">Add your feature description here.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-roboto">Feature 3</h3>
              <p className="text-gray-600 font-roboto">Add your feature description here.</p>
            </div>
          </div>
        </div>
      </div>
      
   </div>
  )
}