'use client';
import { useEffect } from 'react';

export function LandingPage() {

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.fade-in-up');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);



  return (
    <div>
      {/* Hero container */}
      <div className="w-full h-[95vh] relative">
        
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
        
       {/* Content layer - Stack on mobile, side-by-side on desktop */}
<div className="relative flex flex-col sm:flex-row h-full">
  {/* First column - Content */}
  <div className="flex-1 flex items-center justify-center md:justify-end px-4 md:pr-8 sm:pb-24 md:pb-28">
    <div className="max-w-2xl">
      <h1 className="text-xl md:text-[2rem] lg:text-[2rem] xl:text-[3rem] font-bold text-white pl-6 ">
        Master Stock Trading,
      </h1>
      <h1 className="text-xl md:text-[2rem] lg:text-[2rem] xl:text-[3rem] font-bold text-white pl-6 pb-6">
        Risk-Free.
      </h1>
      <p className="text-sm md:text-[1rem] lg:text-[1.3rem] pl-6 text-gray-100">
        Practice your strategies with real-time market data, build a virtual portfolio, and learn to trade without risking a single dollar. 
      </p>
      
      {/* Buttons Container */}
      <div className="flex flex-row items-center gap-6 mt-8 pl-6">
        <a 
          href="/"
          className="px-2 py-3 sm:px-2 sm:py-2 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-4 bg-gradient-to-r from-cyan-800 to-cyan-400 text-white font-bold rounded-lg shadow-xl hover:opacity-90 transition-opacity duration-200 text-xs md:text-sm lg:text-lg whitespace-nowrap"
        >
          Start Trading For Free
        </a>
        <a 
          href="#preview-section"
          className="px-4 py-3 sm:px-2 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-4 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 text-xs md:text-sm lg:text-lg whitespace-nowrap"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>

  {/* Second column - Image (below text on mobile) */}
  <div className="flex-1 flex items-top justify-start md:justify-start md:items-center px-4 md:px-0 pb-28">
    <img 
      className="h-[16rem] md:h-[50vh] object-contain animate-float max-w-full" 
      src="/homepagepicture.png" 
      alt="Trading interface" 
    />
  </div>

          {/* Bottom arrow section */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <a 
              href="#preview-section"
              className="text-white sm:text-md md:text-md md:text-md lg:text-2xl mb-2 font-roboto block fade-in-up"
            >
              Click to learn more
            </a>      
            <a 
              href="#preview-section"
              className="cursor-pointer hover:scale-110 transition-transform duration-200 animate-bounce inline-block md:mb-4 "
              aria-label="Scroll to learn more"
            >
              <img src="/arrow.svg" alt="Scroll down arrow" className="w-12 h-12 sm:w-8 sm:h-8 md:w-8 md:h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
<div id="preview-section" className="min-h-screen bg-gray-900 p-4 md:p-8">
  <div className="max-w-7xl mx-auto pt-3 md:pt-8">
    <h2 className="text-xl md:text-4xl font-bold text-white mb-4 text-center font-roboto fade-in-up">
      Experience the Power of VirtuTrade
    </h2>
    <p className="text-md md:text-lg text-gray-300 text-center font-roboto mb-12 max-w-3xl mx-auto fade-in-up">
      See how our intuitive platform helps you master trading with professional-grade tools and real-time insights.
    </p>
    
    {/* Dashboard Screenshots - No containers, just images */}
    <div className="flex flex-col md:flex-row space-x-12  items-center ">
      {/* Dashboard Preview 1 */}
      <div className="fade-in-up">
        <div className="text-center">
          <h3 className="text-xl md:text-3xl font-bold text-white mb-3 font-roboto">Intuitive Dashboard</h3>
          <p className="text-md md:text-lg text-gray-400 font-roboto mb-6 max-w-2xl mx-auto">
            Get a comprehensive view of the market and your portfolio at a glance.
          </p>
        </div>
        <div className="relative group cursor-pointer" onClick={() => window.open('/homepage.JPG', '_blank')}>
          <img 
            src="/homepage.JPG" 
            alt="VirtuTrade Dashboard Preview" 
            className="w-full h-full rounded-lg shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Dashboard Preview 2 */}
      <div className="fade-in-up">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-3xl pt-12 md:pt-0 font-bold text-white mb-3 font-roboto">Detailed Portfolio Analysis</h3>
          <p className="text-md md:text-lg text-gray-400 font-roboto max-w-2xl mx-auto">
            Track your performance with in-depth portfolio analytics and insights.
          </p>
        </div>
        <div className="relative group cursor-pointer" onClick={() => window.open('/portfolioview.JPG', '_blank')}>
          <img 
            src="/portfolioview.JPG" 
            alt="Portfolio Analysis Preview" 
            className="w-full h-full rounded-lg shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div className="mt-20 text-center fade-in-up">
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-roboto">
        Ready to Start Your Trading Journey?
      </h2>
      <p className="text-sm md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-roboto">
        Join traders who are honing their skills with VirtuTrade. Sign up today and take your first step towards mastering the market.
      </p>
      <a 
        href="/api/auth/signin"
        className="inline-block px-4 md:px-10 py-4 bg-gradient-to-r from-cyan-800 to-cyan-400 text-white font-bold rounded-lg shadow-xl hover:opacity-90 transition-opacity duration-200 text-lg"
      >
        Create Your Free Account
      </a>
    </div>
  </div>
</div>

      
    </div>
  );
}