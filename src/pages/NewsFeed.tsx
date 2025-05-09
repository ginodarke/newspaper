import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles } from '../services/news';
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

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user location for local news
      const locationData = await getUserLocation();
      
      // Get articles based on user preferences and/or location
      const response = await getArticles({
        page,
        pageSize: articlesPerPage,
        userPreferences: user ? {
          categories: user.preferences?.categories || ['general'],
          sources: user.preferences?.sources || [],
          interests: user.preferences?.interests || [],
          location: locationData?.formattedAddress || ''
        } : undefined,
        location: locationData
      });
      
      setArticles(response.articles);
      setTotalPages(Math.ceil(response.totalResults / articlesPerPage));
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles(1);
    setRefreshing(false);
  };

  useEffect(() => {
    loadArticles();
  }, [user]);

  const handlePageChange = (page: number) => {
    loadArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = (articleId: string) => {
    // In a real app, this would save the article to the user's saved articles
    console.log(`Saving article ${articleId}`);
  };

  const handleShareArticle = (articleId: string) => {
    // In a real app, this would share the article
    console.log(`Sharing article ${articleId}`);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticleDetail = () => {
    setSelectedArticle(null);
  };

  // Display loading state
  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-muted-foreground">Loading your personalized news feed...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Failed to Load News</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render news feed
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Today's News</h1>
          <p className="text-muted-foreground">
            {user ? 'Personalized for you' : 'Trending news stories'}
            {!user && (
              <button 
                onClick={() => navigate('/auth')} 
                className="ml-2 text-primary hover:underline"
              >
                Sign in for personalized news
              </button>
            )}
          </p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Featured Articles */}
      {articles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured Article */}
            {articles[0] && (
              <div className="lg:col-span-2">
                <ArticleCard 
                  article={articles[0]} 
                  isMainFeatured={true}
                />
              </div>
            )}
            
            {/* Secondary Featured Articles */}
            <div className="grid grid-cols-1 gap-6">
              {articles.slice(1, 3).map((article) => (
                <ArticleCard 
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(3).map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
        
        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">Try refreshing or adjusting your preferences</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-primary/10 text-foreground'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <ArticleDetail 
              article={selectedArticle}
              onClose={handleCloseArticleDetail}
              onSave={handleSaveArticle}
              onShare={() => handleShareArticle(selectedArticle.id)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
} 