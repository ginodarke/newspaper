import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, UserCheck } from 'lucide-react';

import { Article } from '../types';
import NewsCard from '../components/NewsCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles } from '../services/news';
import { getUserLocation } from '../services/location';
import { getUserPreferences } from '../services/news';
import { useAuth } from '../hooks/useAuth';

export default function ForYou() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load articles when component mounts
  useEffect(() => {
    loadArticles();
  }, [user]);

  // Load personalized articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is signed in
      if (!user) {
        setError('Please sign in to see personalized news');
        setLoading(false);
        return;
      }
      
      // Get user preferences
      const { preferences: userPreferences, error: preferencesError } = 
        await getUserPreferences(user.id);
      
      if (preferencesError || !userPreferences) {
        setError('Unable to load your preferences. Please update your profile.');
        setLoading(false);
        return;
      }
      
      // Get user location if available
      let location = undefined;
      
      try {
        location = await getUserLocation();
      } catch (err) {
        console.error('Error getting user location:', err);
      }
      
      // Get personalized news
      const options = {
        pageSize: 20,
        location,
        userPreferences: userPreferences || undefined,
        sortBy: 'relevance' as const
      };
      
      const { articles: fetchedArticles } = await getArticles(options);
      
      setArticles(fetchedArticles);
    } catch (err) {
      setError('Error loading personalized news');
      console.error('Error loading personalized news:', err);
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
  };
  
  // Handle close article detail
  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };
  
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
        <h1 className="text-3xl font-bold flex items-center">
          <UserCheck size={28} className="mr-3 text-primary" />
          <span>For You</span>
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
      
      {error && !selectedArticle && (
        <div className="mb-8 p-4 bg-primary-bg border border-border rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 text-primary" />
          <p className="text-text-primary">{error}</p>
        </div>
      )}
      
      {selectedArticle ? (
        <div className="mb-8">
          <ArticleDetail 
            article={selectedArticle} 
            onClose={handleCloseArticle}
            onSave={handleSaveArticle}
            onShare={() => {}} 
          />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : articles.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {articles.map((article, index) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <NewsCard 
                    article={article}
                    featured={index === 0 || index === 1}
                    size={index === 0 || index === 1 ? 'large' : 'medium'}
                    onClick={() => handleArticleClick(article)}
                    onSave={handleSaveArticle}
                    onShare={handleShareArticle}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : !error ? (
            <div className="text-center py-12">
              <p className="text-lg text-text-secondary">No personalized news available.</p>
              <p className="text-sm text-text-secondary mt-2">
                Try updating your profile preferences to see more relevant content.
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Update Preferences
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
} 