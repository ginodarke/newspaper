import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Article } from '../types';
import { getSavedArticles, removeFromSaved } from '../services/news';
import NewsCard from '../components/NewsCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X } from 'lucide-react';

export default function Saved() {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadSavedArticles();
  }, [user]);

  const loadSavedArticles = async () => {
    if (!user) {
      setError('Please sign in to view your saved articles');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const articles = await getSavedArticles(user.email || '');
      setSavedArticles(articles);
    } catch (err) {
      console.error('Error loading saved articles:', err);
      setError('Failed to load your saved articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  const handleRemoveFromSaved = async (articleId: string) => {
    if (!user) return;

    try {
      await removeFromSaved(user.email || '', articleId);
      setSavedArticles((current) => current.filter(a => a.id !== articleId));
      
      // If the currently selected article is being removed, close the detail view
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(null);
      }
    } catch (err) {
      console.error('Error removing article from saved:', err);
    }
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Saved Articles</h1>
        <motion.button
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-elevation-1"
          whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={loadSavedArticles}
        >
          Refresh
        </motion.button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && !loading && (
        <div className="bg-primary-bg/30 text-text-primary p-6 rounded-xl border border-border shadow-elevation-1 text-center">
          <p className="mb-4">{error}</p>
          {!user && (
            <motion.a
              href="/auth"
              className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-elevation-1"
              whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in
            </motion.a>
          )}
        </div>
      )}

      {!loading && !error && savedArticles.length === 0 && (
        <div className="bg-primary-bg/30 text-text-primary p-6 rounded-xl border border-border shadow-elevation-1 text-center">
          <Bookmark size={48} className="mx-auto mb-3 text-text-secondary" />
          <h3 className="text-xl font-medium mb-2">No saved articles yet</h3>
          <p className="text-text-secondary mb-4">
            Articles you save will appear here so you can easily find them later.
          </p>
          <motion.a
            href="/"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-elevation-1"
            whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
            whileTap={{ scale: 0.98 }}
          >
            Browse articles
          </motion.a>
        </div>
      )}

      {!loading && !error && savedArticles.length > 0 && (
        <AnimatePresence>
          {selectedArticle ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <ArticleDetail 
                article={selectedArticle} 
                onClose={handleCloseDetail}
                onSave={() => handleRemoveFromSaved(selectedArticle.id)}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {savedArticles.map(article => (
                <motion.div 
                  key={article.id} 
                  variants={cardVariants}
                  layoutId={`article-${article.id}`}
                  className="relative"
                >
                  <motion.button
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-primary-bg/80 backdrop-blur-sm text-text-primary border border-border shadow-elevation-1 hover:bg-primary-bg transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(article.id);
                    }}
                  >
                    <X size={16} />
                  </motion.button>
                  <NewsCard 
                    article={article} 
                    onClick={() => handleArticleClick(article)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
} 