'use client';

import { useState, useEffect } from 'react';

type Article = {
  id: number;
  headline: string;
  summary: string;
  url: string;
  created_at: string;
  source: string;
  symbols: string[];
  images?: Array<{
    size: string;
    url: string;
  }>;
};

export function MarketNews() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/newsApi');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("articles", data)
        setNews(data.news);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); 

  if (loading) {
    return (
      <div className=" rounded-lg h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" rounded-lg h-full p-4">
        <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error fetching news</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (article: Article) => {
    if (article.images && article.images.length > 0) {
      const smallImage = article.images.find(img => img.size === 'small');
      return smallImage?.url || article.images[0].url;
    }
    return null;
  };



  return (
    <div className=" rounded-lg ">
      {/* Header */}
      <div className="p-1 ">
        <h2 className="text-2xl font-bold text-white flex items-center ">
          
          Latest Market News
        </h2>
      </div>

      {/* News List - Conditionally Scrollable */}
      <div className="h-[19rem] overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {news.filter(article => article.images && article.images.length > 0).map((article) => (
            <article 
              key={article.id} 
              className="bg-[#0F172A] rounded-lg py-2 pl-1 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              <div className="flex gap-4 ">
                {/* Article Image */}
                {getImageUrl(article) && (
                  <div className="flex-shrink-0">
                    <img 
                      src={getImageUrl(article)!} 
                      alt=""
                      className="w-20 h-20 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Article Content */}
                <div className="flex-1 min-w-0 ">
                                     {/* Source and Time */}
                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                     <span className="font-semibold text-blue-400 uppercase">{article.source}</span>
                     <span>•</span>
                     <time dateTime={article.created_at}>
                       {new Date(article.created_at).toLocaleString('en-US', {
                         month: 'short',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </time>
                     {article.symbols && article.symbols.length > 0 && (
                       <>
                         <span>•</span>
                         <div className="flex gap-1">
                           {article.symbols.map((symbol, index) => (
                             <span 
                               key={index}
                               className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs font-medium"
                             >
                              ${symbol}
                             </span>
                           ))}
                         </div>
                       </>
                     )}
                   </div>

                  {/* Headline */}
                  <h3 className="mb-2 ">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors duration-200 line-clamp-2"
                    >
                      {article.headline}
                    </a>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* No news fallback */}
      {news.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No news articles available</p>
        </div>
      )}
    </div>
  );
}