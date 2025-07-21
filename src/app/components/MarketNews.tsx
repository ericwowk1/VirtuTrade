'use client';

import { useState, useEffect } from 'react';

type Article = {
  id: number;
  headline: string;
  summary: string;
  url: string;
  created_at: string;
  source: string;
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
      <div className="bg-[#1E293B] rounded-lg h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E293B] rounded-lg h-full p-4">
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
    <div className="bg-[#1E293B] rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Market News
        </h2>
      </div>

      {/* News List - Scrollable */}
      <div className="overflow-y-20 custom-scrollbar">
        <div className="p-4 space-y-4">
          {news.map((article) => (
            <article 
              key={article.id} 
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              <div className="flex gap-4">
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
                <div className="flex-1 min-w-0">
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
                  </div>

                  {/* Headline */}
                  <h3 className="mb-2">
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