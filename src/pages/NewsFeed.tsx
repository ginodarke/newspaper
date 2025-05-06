import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { getArticles, getUserPreferences, getUserLocationFromPreferences, Article } from '../services/news';
import { LocationData } from '../services/location';
import { AnimatedBackground } from '../components/3DElements';

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
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  const categories = ['All', 'Local', 'Technology', 'Business', 'Politics', 'Science', 'Health', 'Sports', 'Entertainment', 'World News'];
  
  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (user) {
          const prefs = await getUserPreferences(user.id);
          console.log('User preferences:', prefs);
          setPreferences(prefs);
          
          // Get user location from preferences
          const location = await getUserLocationFromPreferences(user.id);
          if (location) {
            console.log('User location:', location);
            setUserLocation(location);
          }
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
        // Fake delay to show loading spinner for a smoother UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const category = activeCategory === 'All' ? null : activeCategory;
        // Pass userLocation as undefined when it's null to match function parameter type
        const data = await getArticles(category, userLocation || undefined);
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
  }, [activeCategory, preferences, userLocation]);
  
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

  // Scroll animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <motion.h1 
                className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                NewspaperAI
              </motion.h1>
              <motion.span 
                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Beta
              </motion.span>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={(query) => navigate(`/search?q=${query}`)} />
              <ThemeToggle />
              <motion.button
                onClick={handleProfileClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* User Location */}
          {userLocation && (
            <motion.div 
              className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                {userLocation.city || userLocation.region || `${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`}
              </span>
            </motion.div>
          )}
          
          {/* Category tabs */}
          <div className="mt-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 pb-1">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white shadow-sm dark:bg-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {category === 'Local' ? (
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{category}</span>
                    </div>
                  ) : (
                    category
                  )}
                </motion.button>
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
          <motion.div 
            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg p-4 my-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
        
        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v10a2 2 0 002 2h5zM2 10h8" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No articles found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try selecting a different category or updating your preferences.</p>
          </motion.div>
        )}
        
        {/* Articles grid */}
        {!loading && !error && articles.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  layout
                  transition={{ type: "spring", damping: 20 }}
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
          </motion.div>
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
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
              onClick={handleCloseArticle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
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