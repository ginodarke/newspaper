import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
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

  // Load articles based on category and preferences
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user location for local news
      let locationData = undefined;
      try {
        locationData = await getUserLocation();
      } catch (locErr) {
        console.warn('Could not get user location:', locErr);
      }
      
      // Get articles based on category or user preferences
      const options = { 
        category: category || undefined,
        location: locationData,
        userPreferences: user?.preferences ? {
          categories: user.preferences.categories || [],
          sources: user.preferences.sources || [],
          interests: user.preferences.interests || [],
          location: user.preferences.location || ''
        } : undefined
      };
      
      const { articles: fetchedArticles, totalResults } = await getArticles(options);
      
      if (fetchedArticles.length === 0) {
        setError('No articles found. Try a different category or refresh.');
      } else {
        setArticles(fetchedArticles);
        setTotalPages(Math.ceil(totalResults / articlesPerPage));
      }
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle article click to view details
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    // Update URL without full navigation
    window.history.pushState({}, '', `/article/${article.id}`);
  };

  // Handle closing article detail view
  const handleCloseArticleDetail = () => {
    setSelectedArticle(null);
    // Remove article ID from URL when closing detail view
    if (articleId) {
      navigate('/categories/' + (category || ''));
    }
  };

  // Handle saving an article
  const handleSaveArticle = (articleId: string) => {
    console.log('Saving article:', articleId);
    // Implement save functionality
  };

  // Handle sharing an article
  const handleShareArticle = (articleId: string) => {
    console.log('Sharing article:', articleId);
    // Implement share functionality
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // If we have a selected article or article ID, show the article detail view
  if (selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ArticleDetail 
          article={selectedArticle}
          onClose={handleCloseArticleDetail}
          onSave={handleSaveArticle}
          onShare={() => handleShareArticle(selectedArticle.id)}
        />
      </div>
    );
  }

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
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onClick={() => handleArticleClick(article)}
              onSave={() => handleSaveArticle(article.id)}
              onShare={() => handleShareArticle(article.id)}
            />
          ))}
        </div>
      ) : !error && !loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No articles to display.</p>
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
                    : 'bg-card text-muted-foreground hover:bg-primary/10'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
} 