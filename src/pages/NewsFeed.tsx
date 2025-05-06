import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { getArticles, getUserPreferences, Article } from '../services/news';

export default function NewsFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories = ['All', 'Technology', 'Business', 'Politics', 'Science', 'Health', 'Sports', 'Entertainment', 'World News'];
  
  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (user) {
          const prefs = await getUserPreferences(user.id);
          console.log('User preferences:', prefs);
          setPreferences(prefs);
        } else {
          console.log('No user found, using default preferences');
          setPreferences({
            categories: ['Technology', 'Business']
          });
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setPreferences({
          categories: ['Technology', 'Business']
        });
      }
    };
    
    fetchPreferences();
  }, [user]);
  
  // Fetch articles based on active category
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fake delay to show loading spinner
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const category = activeCategory === 'All' ? null : activeCategory;
        const data = await getArticles(category);
        setArticles(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if preferences are loaded
    if (preferences) {
      fetchArticles();
    }
  }, [activeCategory, preferences]);
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };
  
  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };
  
  const handleExpandClick = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                NewspaperAI
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                Beta
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={(query) => navigate(`/search?q=${query}`)} />
              <ThemeToggle />
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Category tabs */}
          <div className="mt-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white shadow-sm dark:bg-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg p-4 my-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v10a2 2 0 002 2h5zM2 10h8" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No articles found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try selecting a different category or updating your preferences.</p>
          </div>
        )}
        
        {/* Articles grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard
                    article={article}
                    onClick={() => handleArticleClick(article)}
                    onExpandClick={() => handleExpandClick(article.id)}
                    isExpanded={expandedArticle === article.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      
      {/* Article detail modal */}
      {selectedArticle && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCloseArticle}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] mx-auto my-8 overflow-hidden rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <ArticleDetail article={selectedArticle} onClose={handleCloseArticle} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 