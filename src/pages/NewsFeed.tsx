import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getArticles, getUserPreferences, Article } from '../services/news';
import { enrichArticleWithAI } from '../services/aiSummary';
import ArticleDetail from '../components/ArticleDetail';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import { Link, useNavigate } from 'react-router-dom';

export default function NewsFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('For You');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  
  // Categories for the tabs
  const categories = ['For You', 'Trending', 'Local', 'International', 'National'];
  
  // Fetch user preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { preferences } = await getUserPreferences(user.id);
        setUserPreferences(preferences);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
      }
    };
    
    fetchUserPreferences();
  }, [user]);
  
  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get articles based on the active category and user preferences
        const fetchedArticles = await getArticles(userPreferences || undefined);
        
        // Enrich articles with AI if user is logged in
        if (user && userPreferences) {
          const enrichPromises = fetchedArticles.map(article => 
            enrichArticleWithAI(article, userPreferences)
          );
          
          const enrichedArticles = await Promise.all(enrichPromises);
          setArticles(enrichedArticles);
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err: any) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [user, activeCategory, userPreferences]); // Refetch when user, category, or preferences change

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };
  
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary dark:text-white">Newspaper.AI</h1>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back</span>
                  <Link 
                    to="/profile" 
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Go to Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <Link to="/auth" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 mb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* News Feed */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 rounded-lg text-center">
            <p>{error}</p>
            <button 
              onClick={() => setActiveCategory(activeCategory)} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-6 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-center">
            <p>No articles found for this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map(article => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleArticleClick(article)}
                    >
                      <h2 className="text-xl font-bold hover:text-primary dark:hover:text-primary-400">{article.title}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{article.source}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-md">
                      {article.category}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                    {article.summary}
                  </p>
                  
                  {article.relevanceReason && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm">
                      <strong>Why this matters to you:</strong> {article.relevanceReason}
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                      className="text-primary dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      {expandedArticle === article.id ? 'Hide context' : 'Show context'}
                    </button>
                    
                    <button 
                      onClick={() => handleArticleClick(article)}
                      className="text-primary dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      Read full article
                    </button>
                  </div>
                  
                  {expandedArticle === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <h3 className="font-medium mb-2">Additional Context</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {article.content || 'This topic has been developing over the last few months. Similar events occurred in 2019 and 2021. Experts suggest this could have significant implications for future developments in this field.'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
} 