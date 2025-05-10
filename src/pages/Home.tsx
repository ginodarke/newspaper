import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Globe, Zap, MapPin, AlertCircle } from 'lucide-react';

import { Article } from '../types';
import { getArticles, getTrendingArticles } from '../services/news';
import { getUserLocation } from '../services/location';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { categories } from '../components/layout/Sidebar';
import DeploymentTest from '../components/DeploymentTest';

export default function Home() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [nationalArticles, setNationalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadFeaturedArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user location if available
        let location = undefined;
        
        try {
          location = await getUserLocation();
        } catch (err) {
          console.error('Error getting user location:', err);
        }
        
        // Get trending articles
        let trending = [];
        try {
          trending = await getTrendingArticles();
          console.log(`Fetched ${trending.length} trending articles`);
        } catch (err) {
          console.error('Error getting trending articles:', err);
          
          // Fallback to regular articles with popularity sorting
          const { articles } = await getArticles({
            pageSize: 6,
            sortBy: 'popularity'
          });
          trending = articles;
        }
        
        // Get local articles if location available
        let local: Article[] = [];
        if (location) {
          try {
            const { articles } = await getArticles({
              pageSize: 4,
              location,
              sortBy: 'relevance'
            });
            local = articles;
            console.log(`Fetched ${local.length} local articles`);
          } catch (err) {
            console.error('Error getting local articles:', err);
          }
        }
        
        // Get national articles
        let national: Article[] = [];
        try {
          const country = location?.country || 'us';
          const { articles } = await getArticles({
            pageSize: 4,
            country,
            category: 'general'
          });
          national = articles;
          console.log(`Fetched ${national.length} national articles`);
        } catch (err) {
          console.error('Error getting national articles:', err);
        }
        
        setTrendingArticles(trending);
        setLocalArticles(local);
        setNationalArticles(national);
      } catch (err) {
        setError('Failed to load featured articles');
        console.error('Error loading featured articles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedArticles();
  }, []);
  
  const handleArticleClick = (article: Article) => {
    navigate(`/feed/${article.id}`);
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
  
  const sectionHeaderVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Show loading spinner during initial load
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-8 p-4 bg-primary-bg border border-border rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 text-primary" />
          <p className="text-text-primary">{error}</p>
        </div>
      )}
      
      {/* Deployment Test Component */}
      <DeploymentTest />
      
      {/* Welcome Section */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-3 text-text-primary">
          <span className="text-primary">Newspaper</span>
          <span className="text-secondary">.AI</span>
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Your personalized AI-powered news experience. Discover articles that matter to you with insightful summaries and analysis.
        </p>
      </motion.div>
      
      {/* Trending News Section */}
      <section className="mb-12">
        <motion.div 
          className="flex items-baseline justify-between mb-6"
          variants={sectionHeaderVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center">
            <TrendingUp size={24} className="text-primary mr-3" />
            <h2 className="text-2xl font-bold text-text-primary">Trending Now</h2>
          </div>
          <Link 
            to="/trending" 
            className="text-sm font-medium text-primary flex items-center hover:text-primary/80 transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </motion.div>
        
        {trendingArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary">No trending news available right now.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {trendingArticles.slice(0, 4).map((article, index) => (
              <motion.div key={article.id} variants={itemVariants}>
                <NewsCard 
                  article={article}
                  featured={index === 0}
                  size={index === 0 ? 'large' : 'medium'}
                  onClick={() => handleArticleClick(article)}
                  onSave={() => {}}
                  onShare={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
      
      {/* Local News Section (if available) */}
      {localArticles.length > 0 && (
        <section className="mb-12">
          <motion.div 
            className="flex items-baseline justify-between mb-6"
            variants={sectionHeaderVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center">
              <MapPin size={24} className="text-primary mr-3" />
              <h2 className="text-2xl font-bold text-text-primary">Local News</h2>
            </div>
            <Link 
              to="/local" 
              className="text-sm font-medium text-primary flex items-center hover:text-primary/80 transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {localArticles.slice(0, 3).map((article, index) => (
              <motion.div key={article.id} variants={itemVariants}>
                <NewsCard 
                  article={article}
                  featured={false}
                  size="medium"
                  onClick={() => handleArticleClick(article)}
                  onSave={() => {}}
                  onShare={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
      
      {/* National News */}
      {nationalArticles.length > 0 && (
        <section className="mb-12">
          <motion.div 
            className="flex items-baseline justify-between mb-6"
            variants={sectionHeaderVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center">
              <Globe size={24} className="text-primary mr-3" />
              <h2 className="text-2xl font-bold text-text-primary">National Headlines</h2>
            </div>
            <Link 
              to="/national" 
              className="text-sm font-medium text-primary flex items-center hover:text-primary/80 transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {nationalArticles.slice(0, 3).map((article, index) => (
              <motion.div key={article.id} variants={itemVariants}>
                <NewsCard 
                  article={article}
                  featured={false}
                  size="medium"
                  onClick={() => handleArticleClick(article)}
                  onSave={() => {}}
                  onShare={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
      
      {/* Discover More */}
      <motion.section 
        className="mt-16 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">Discover News Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category: {key: string, name: string, icon: React.ReactNode}) => (
              <Link 
                key={category.key} 
                to={`/category/${category.key}`}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-card-gradient hover:shadow-elevation-2 transition-all hover:translate-y-[-2px]"
              >
                <span className="text-primary mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-text-primary">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
} 