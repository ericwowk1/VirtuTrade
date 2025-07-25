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
      <div className="rounded-lg bg-slate-800/60 border border-slate-700 h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-slate-800/60 border border-slate-700 h-full p-4">
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

  const filteredNews = news.filter(article => article.images && article.images.length > 0);
  const featuredArticle = filteredNews[0];
  const remainingArticles = filteredNews.slice(1);

  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700 p-[1rem]  ">
      {/* Header */}
      <div className="border-b-2 border-white  mb-4">
        <h2 className="text-2xl  text-white text-center mb-4">
            Latest Market News
        </h2>
      </div>

      {/* News Content */}
      <div className="h-[47rem] overflow-y-auto custom-scrollbar pr-[0.5rem]">
        {/* Featured Article */}
        {featuredArticle && (
          <article className="mb-3 pb-3 border-b border-gray-700">
            <a 
              href={featuredArticle.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block"
            >
              {getImageUrl(featuredArticle) && (
                <div className="relative mb-2 overflow-hidden rounded-lg">
                  <img 
                    src={getImageUrl(featuredArticle)!} 
                    alt=""
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}
              
              {/* Featured Article Meta */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span className="text-blue-400 font-bold uppercase">{featuredArticle.source}</span>
                <span>•</span>
                <time dateTime={featuredArticle.created_at}>
                  {new Date(featuredArticle.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>

              {/* Featured Headline */}
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {featuredArticle.headline}
              </h3>

              {/* Featured Tickers */}
              {featuredArticle.symbols && featuredArticle.symbols.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {featuredArticle.symbols.slice(0, 3).map((symbol, index) => (
                    <span 
                      key={index}
                      className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[11px] font-medium"
                    >
                      ${symbol}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </article>
        )}

        {/* Regular Articles */}
        <div className="space-y-2">
          {remainingArticles.map((article) => (
            <article 
              key={article.id} 
              className="group"
            >
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              >
                {/* Article Image */}
                {getImageUrl(article) && (
                  <div className="flex-shrink-0">
                    <img 
                      src={getImageUrl(article)!} 
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                    <span className="text-blue-400 font-semibold">{article.source}</span>
                    <span>•</span>
                    <time dateTime={article.created_at}>
                      {new Date(article.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>

                  {/* Headline */}
                  <h3 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                    {article.headline}
                  </h3>

                  {/* Tickers */}
                  {article.symbols && article.symbols.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {article.symbols.slice(0, 2).map((symbol, index) => (
                        <span 
                          key={index}
                          className="bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded text-[9px] font-medium"
                        >
                          ${symbol}
                        </span>
                      ))}
                      {article.symbols.length > 2 && (
                        <span className="text-[9px] text-gray-500">
                          +{article.symbols.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* No news fallback */}
      {filteredNews.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No news articles available</p>
        </div>
      )}
    </div>
  );
}