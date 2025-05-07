import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getNews, getArticles } from '../services/news';
import ArticleCard from '../components/ArticleCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';
import { getUserLocationFromPreferences } from '../services/news';

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  
  const ARTICLES_PER_PAGE = 12;

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      // Try to get user location from preferences for personalized content
      let userLocation = undefined;
      if (user) {
        try {
          const locationData = await getUserLocationFromPreferences(user.id);
          if (locationData) {
            userLocation = locationData;
          }
        } catch (err) {
          console.error('Error getting user location from preferences:', err);
        }
      }
      
      // Get articles based on user preferences
      const newArticles = await getArticles(null, userLocation);
      
      setArticles(newArticles);
      setTotalPages(Math.ceil(newArticles.length / ARTICLES_PER_PAGE));
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (articleId: string) => {
    // Implement save functionality
    console.log('Save article:', articleId);
  };

  const handleShare = async (articleId: string) => {
    // Implement share functionality
    console.log('Share article:', articleId);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Get current articles for the page
  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadArticles();
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Your News Feed</h1>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      )}
      
      {/* Featured Articles Section */}
      {!loading && currentArticles.length > 0 && currentPage === 1 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {currentArticles.slice(0, 2).map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="lg:col-span-1"
                >
                  <ArticleCard
                    article={article}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* All Articles Section */}
      {!loading && currentArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {currentPage === 1 ? "Latest Articles" : `Page ${currentPage}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {(currentPage === 1 ? currentArticles.slice(2) : currentArticles).map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard
                    article={article}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Pagination Controls */}
      {!loading && currentArticles.length > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && currentArticles.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">No Articles Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any articles that match your preferences. Try updating your interests in your profile.
            </p>
            <button
              onClick={loadArticles}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 