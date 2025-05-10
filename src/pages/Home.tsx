import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Globe, Zap } from 'lucide-react';

import { Article } from '../types';
import { getArticles } from '../services/news';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { categories } from '../components/layout/Sidebar';

export default function Home() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadFeaturedArticles = async () => {
      try {
        setLoading(true);
        
        // Get trending articles
        const { articles: trending } = await getArticles({ 
          pageSize: 6, 
          sortBy: 'popularity' 
        });
        
        // Get local articles
        const { articles: local } = await getArticles({ 
          pageSize: 3, 
          category: 'general',
          country: 'us' // Default to US if no location available
        });
        
        setTrendingArticles(trending);
        setLocalArticles(local);
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
  
  const categoryItemVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.section 
        className="mb-16 relative overflow-hidden rounded-3xl bg-primary-bg-dark p-8 md:p-12 shadow-elevation-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4 text-text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your <span className="text-primary">personalized</span> news experience
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-text-secondary mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            AI-powered news curation tailored to your interests. Stay informed with relevant stories that matter to you.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link 
              to="/feed" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium shadow-elevation-1 hover:shadow-elevation-2 transition-all"
            >
              Browse News Feed
            </Link>
            <Link 
              to="/auth" 
              className="bg-secondary-bg hover:bg-secondary-bg/90 text-text-primary px-6 py-3 rounded-md font-medium shadow-elevation-1 hover:shadow-elevation-2 transition-all"
            >
              Sign Up for Free
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 bottom-0 w-64 h-64 blur-3xl rounded-full bg-primary/20 -mr-20 -mb-20 opacity-50"></div>
        <div className="absolute right-32 top-0 w-32 h-32 blur-3xl rounded-full bg-accent-blue/30 -mr-10 -mt-10 opacity-50"></div>
      </motion.section>
      
      {/* Trending News Section */}
      <motion.section 
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.div className="flex items-center" variants={itemVariants}>
            <TrendingUp size={24} className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Trending News</h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to="/feed" className="text-primary hover:text-primary/80 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {trendingArticles.slice(0, 6).map((article, index) => (
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
      </motion.section>
      
      {/* Categories Section */}
      <motion.section 
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 text-text-primary flex items-center"
          variants={itemVariants}
        >
          <Globe size={24} className="mr-2 text-primary" />
          Explore Categories
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {categories.map((category, index) => (
            <motion.div key={category.key} variants={categoryItemVariants} custom={index}>
              <Link
                to={`/category/${category.key}`}
                className="bg-secondary-bg hover:bg-primary-bg text-text-primary p-6 rounded-lg flex flex-col items-center justify-center text-center transition-all hover:shadow-elevation-2 shadow-elevation-1 inner-light aspect-square"
              >
                <span className="text-primary text-2xl mb-3">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* Local News Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.div className="flex items-center" variants={itemVariants}>
            <Zap size={24} className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Local News</h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to="/local" className="text-primary hover:text-primary/80 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {localArticles.slice(0, 3).map((article, index) => (
              <motion.div key={article.id} variants={itemVariants}>
                <NewsCard 
                  article={article}
                  size="medium"
                  onClick={() => handleArticleClick(article)}
                  onSave={() => {}}
                  onShare={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
} 