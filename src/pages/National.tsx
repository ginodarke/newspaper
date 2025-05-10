import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, Globe } from 'lucide-react';

import { Article } from '../types';
import NewsCard from '../components/NewsCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles } from '../services/news';
import { getUserLocation } from '../services/location';
import { useAuth } from '../hooks/useAuth';

export default function National() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load articles when component mounts
  useEffect(() => {
    loadArticles();
  }, []);

  // Load national articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user location
      let location = undefined;
      let country = null;
      
      try {
        location = await getUserLocation();
        if (location?.country) {
          country = location.country;
          setUserCountry(country);
        }
      } catch (err) {
        console.error('Error getting user location:', err);
        setError('Unable to determine your country. Showing general news instead.');
      }
      
      // Get national news
      const options = {
        pageSize: location?.country ? 30 : 20,
        location,
        category: 'general',
        country: country || undefined
      };
      
      const { articles: fetchedArticles } = await getArticles(options);
      
      // Filter articles to prioritize those that mention the country in title/description
      if (country) {
        const countryRegex = new RegExp(country, 'i');
        const countryArticles = fetchedArticles.filter(article => 
          countryRegex.test(article.title) || 
          (article.description && countryRegex.test(article.description))
        );
        
        const otherArticles = fetchedArticles.filter(article => 
          !countryRegex.test(article.title) && 
          (!article.description || !countryRegex.test(article.description))
        );
        
        setArticles([...countryArticles, ...otherArticles]);
      } else {
        setArticles(fetchedArticles);
      }
    } catch (err) {
      setError('Error loading national news');
      console.error('Error loading national news:', err);
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
          <Globe size={28} className="mr-3 text-primary" />
          <span>
            {userCountry ? `${userCountry} News` : 'National News'}
          </span>
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
              <p className="text-lg text-text-secondary">No national news available.</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
} 