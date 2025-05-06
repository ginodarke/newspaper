import { useState, useEffect } from 'react';
import { Article, getAISummary } from '../services/news';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const [activeTab, setActiveTab] = useState<'article' | 'analysis' | 'context'>('article');
  const [fullSummary, setFullSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Load full AI summary on demand
  const loadFullSummary = async () => {
    if (fullSummary || loadingSummary) return;
    
    setLoadingSummary(true);
    try {
      const summary = await getAISummary(article);
      setFullSummary(summary);
    } catch (error) {
      console.error('Error loading full AI summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };
  
  // Load full summary when analysis tab is selected
  useEffect(() => {
    if (activeTab === 'analysis') {
      loadFullSummary();
    }
  }, [activeTab]);
  
  // Calculate trending indicator
  const getTrendingIndicator = (score?: number) => {
    if (!score) return 'Average';
    if (score >= 90) return 'Highly Trending';
    if (score >= 80) return 'Trending';
    if (score >= 70) return 'Popular';
    return 'Average';
  };
  
  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{article.title}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex px-4 -mb-px">
          <button
            onClick={() => setActiveTab('article')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'article'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Article
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'context'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Related Context
          </button>
        </nav>
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'article' && (
          <div className="space-y-4">
            {article.imageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[300px] object-cover" />
                <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/70 to-transparent w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{article.source}</span>
                    <span className="text-white text-sm">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                {article.category}
              </span>
              
              {article.trendingScore && (
                <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  {getTrendingIndicator(article.trendingScore)}
                </span>
              )}
              
              {article.isLocalNews && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Local News
                </span>
              )}
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.publishedAt).toLocaleString()}
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="font-medium text-gray-900 dark:text-white">{article.summary}</p>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  <p>
                    {article.description || 'Full article content is not available at this moment. Please check back later or visit the original source.'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Key Features Section */}
            {article.keyFeatures && article.keyFeatures.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Key Takeaways</h3>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                  {article.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {article.locationRelevance && (
              <div className="p-3 bg-green-50 text-green-800 rounded-md dark:bg-green-900/30 dark:text-green-300 flex items-start gap-2 mt-4">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{article.locationRelevance}</span>
              </div>
            )}
            
            {article.url && (
              <div className="mt-6">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
                >
                  <span>Read on {article.source}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">AI Summary</h3>
                {loadingSummary && (
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                )}
              </div>
              <p className="text-blue-700 dark:text-blue-200">
                {loadingSummary ? "Generating comprehensive analysis..." : 
                  fullSummary || 
                  article.aiSummary || 
                  `This article covers ${article.title}. The key points include important developments in ${article.category.toLowerCase()} and potential impacts on readers.`}
              </p>
            </div>
            
            {article.keyFeatures && article.keyFeatures.length > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Key Features</h3>
                <ul className="list-disc pl-5 text-purple-700 dark:text-purple-200 space-y-1">
                  {article.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {article.relevanceReason && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Why This Matters To You</h3>
                <p className="text-green-700 dark:text-green-200">{article.relevanceReason}</p>
              </div>
            )}
            
            {article.trendingScore && (
              <div className="p-4 bg-pink-50 dark:bg-pink-900/30 rounded-lg border border-pink-100 dark:border-pink-800">
                <h3 className="text-lg font-medium text-pink-800 dark:text-pink-300 mb-2">Trending Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-pink-700 dark:text-pink-200 mb-1">Trending Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-pink-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${article.trendingScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-pink-700 dark:text-pink-200 mt-1 text-right">
                      {getTrendingIndicator(article.trendingScore)} ({article.trendingScore}%)
                    </p>
                  </div>
                  <p className="text-pink-700 dark:text-pink-200">
                    This article has {article.trendingScore >= 80 ? 'high' : 'moderate'} engagement 
                    with readers interested in {article.category}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'context' && (
          <div className="space-y-4">
            {article.locationRelevance && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Local Impact</h3>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-700 dark:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-green-700 dark:text-green-200">{article.locationRelevance}</p>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Historical Context</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This topic has been developing over several months. Similar events occurred in previous years, with varying outcomes and public reception.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Related Topics</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {[article.category, ...(article.category === 'Technology' ? ['Innovation', 'Digital', 'AI'] : 
                   article.category === 'Business' ? ['Economy', 'Markets', 'Trade'] :
                   article.category === 'Politics' ? ['Government', 'Policy', 'Elections'] :
                   article.category === 'Science' ? ['Research', 'Discovery', 'Environment'] :
                   article.category === 'Health' ? ['Medical', 'Wellness', 'Healthcare'] :
                   article.category === 'Sports' ? ['Athletics', 'Teams', 'Competition'] :
                   article.category === 'Entertainment' ? ['Media', 'Celebrities', 'Culture'] :
                   article.category === 'World News' ? ['International', 'Global', 'Diplomacy'] :
                   ['Current Events', 'News', 'Trending'])].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Similar Articles</h3>
              <ul className="space-y-3 mt-2">
                {[1, 2, 3].map(i => (
                  <li key={i} className="border-b border-gray-200 dark:border-gray-600 last:border-0 pb-2 last:pb-0">
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Related article about {article.title.split(' ').slice(0, 3).join(' ')}...
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Published {Math.floor(Math.random() * 7) + 1} days ago
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 