import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

import { Article } from '../types';
import NewsCard from '../components/NewsCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles, getArticleById } from '../services/news';
import { getUserLocation } from '../services/location';
import { useAuth } from '../hooks/useAuth';

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const articlesPerPage = 9;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: articleId, category } = useParams<{ id?: string, category?: string }>();

  // Load articles when component mounts
  useEffect(() => {
    loadArticles();
  }, [category]);

  // Handle article ID in URL
  useEffect(() => {
    if (articleId) {
      loadArticleById(articleId);
    }
  }, [articleId]);

  // Load article by ID
  const loadArticleById = async (id: string) => {
    try {
      setLoading(true);
      const article = await getArticleById(id);
      if (article) {
        setSelectedArticle(article);
      } else {
        setError(`Article with ID ${id} not found`);
        navigate('/404');
      }
    } catch (err) {
      setError('Error loading article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load articles based on category
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's saved preferences and location if logged in
      let location = undefined;
      
      if (user) {
        try {
          location = await getUserLocation();
        } catch (err) {
          console.error('Error getting user location:', err);
        }
      }
      
      // Set up options
      const options = {
        page: currentPage,
        pageSize: articlesPerPage,
        category: category || null,
        location
      };
      
      // Get articles with pagination
      const { articles: fetchedArticles, totalResults } = await getArticles(options);
      
      setArticles(fetchedArticles);
      setTotalPages(Math.ceil(totalResults / articlesPerPage));
    } catch (err) {
      setError('Error loading news feed');
      console.error('Error loading news feed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };
  
  // Handle article click
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    // Update URL without reloading
    navigate(`/feed/${article.id}`, { replace: true });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // When current page changes, reload articles
  useEffect(() => {
    loadArticles();
  }, [currentPage]);
  
  // Handle save article
  const handleSaveArticle = (articleId: string) => {
    // Add your save functionality here
    console.log('Saving article:', articleId);
  };
  
  // Handle share article
  const handleShareArticle = (articleId: string) => {
    // Add your share functionality here
    console.log('Sharing article:', articleId);
  };
  
  // Animation variants
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
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 'News Feed'}
        </h1>
        <button 
          onClick={handleRefresh} 
          className={`p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          disabled={refreshing}
          aria-label="Refresh"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {selectedArticle ? (
        <div className="mb-8">
          <button 
            onClick={() => {
              setSelectedArticle(null);
              navigate('/feed', { replace: true });
            }}
            className="mb-4 inline-flex items-center text-sm text-primary hover:text-primary/80"
          >
            ← Back to News Feed
          </button>
          <ArticleDetail article={selectedArticle} />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : articles.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {articles.map((article, index) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <NewsCard 
                    article={article}
                    featured={index === 0}
                    size={index === 0 ? 'large' : 'medium'}
                    onClick={() => handleArticleClick(article)}
                    onSave={handleSaveArticle}
                    onShare={handleShareArticle}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : !error ? (
            <div className="text-center py-12">
              <p className="text-lg text-text-secondary">No articles to display.</p>
            </div>
          ) : null}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary-bg text-text-secondary hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 