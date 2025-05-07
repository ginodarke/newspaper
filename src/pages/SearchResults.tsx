import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { searchArticles } from '../services/news';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SearchResults() {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const { ref, inView } = useInView();
  
  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }
    
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const results = await searchArticles(query);
        setArticles(results);
      } catch (err) {
        console.error('Error searching articles:', err);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, navigate]);
  
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };
  
  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };
  
  const handleExpandClick = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };
  
  const handleSave = async (articleId: string) => {
    // Implement save functionality
    console.log('Save article:', articleId);
  };
  
  const handleShare = async (articleId: string) => {
    // Implement share functionality
    console.log('Share article:', articleId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search Results: <span className="text-primary">{query}</span>
      </h1>
      
      {loading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v10a2 2 0 002 2h5zM2 10h8" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-gray-500">Try different search terms or browse categories instead.</p>
        </div>
      )}
      
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
                  onSave={handleSave}
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Load more indicator */}
      <div ref={ref} className="h-10 mt-8"></div>
      
      {/* Article detail modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <button
              onClick={handleCloseArticle}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ArticleDetail article={selectedArticle} onClose={handleCloseArticle} />
          </div>
        </div>
      )}
    </div>
  );
} 