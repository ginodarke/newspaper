import { useState } from 'react';
import { Article } from '../types';
import { getAISummary } from '../services/news';
import { Clock, Eye, Share2, Bookmark, ExternalLink, Cpu, FileText, ChevronLeft, List, MapPin, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleDetailProps {
  article: Article;
  onSave?: (articleId: string) => void;
  onShare?: (article: Article) => void;
  onClose?: () => void;
}

export default function ArticleDetail({ article, onSave, onShare, onClose }: ArticleDetailProps) {
  const [fullSummary, setFullSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Load full AI summary on demand
  const loadFullSummary = async () => {
    if (fullSummary || loadingSummary) return;

    setLoadingSummary(true);
    try {
      const summary = await getAISummary(article);
      setFullSummary(summary);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Extract bullet points from key features or create them from content
  const bulletPoints = article.keyFeatures || 
    article.description?.split('. ').filter(s => s.length > 10).slice(0, 3) || 
    ['No summary available'];

  // Location impact - either use provided or create a default
  const locationImpact = article.locationRelevance || 
    article.relevanceReason || 
    'This news may be relevant to your interests.';

  return (
    <motion.div 
      className="rounded-xl bg-secondary-bg shadow-elevation-3 inner-light overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: '1000px' }}
    >
      {/* Hero Image Section */}
      <div className="relative w-full aspect-video overflow-hidden">
        <motion.img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-news.jpg';
          }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-bg to-transparent"></div>
        
        {/* Back button overlay */}
        {onClose && (
          <motion.button
            className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-2 rounded-full bg-primary-bg-dark/80 text-text-primary backdrop-blur-sm hover:bg-primary-bg transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
          >
            <ChevronLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        )}
        
        {/* Category badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground shadow-elevation-1">
          {article.category}
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        {/* Article metadata */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary font-medium">{article.source}</span>
            <span className="text-sm text-text-secondary">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-text-primary mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {article.title}
          </motion.h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full border border-border shadow-elevation-1 bg-primary-bg/30 flex items-center justify-center overflow-hidden">
                {article.author?.avatar ? (
                  <img
                    src={article.author.avatar}
                    alt={article.author?.name || 'Author'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://source.unsplash.com/random/100x100?portrait';
                    }}
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {article.author?.name?.[0] || 'A'}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-text-primary">{article.author?.name || 'Unknown Author'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-text-secondary">{article.readTime || 3} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm text-text-secondary">{article.views || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Points Card - Always visible */}
        <motion.div 
          className="p-5 mb-8 rounded-lg bg-primary-bg/20 border border-border shadow-elevation-1 text-text-primary relative overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-secondary/30"></div>
          <h3 className="font-medium text-primary mb-3 flex items-center">
            <List size={16} className="mr-2" />
            Key Points
          </h3>
          <ul className="space-y-2">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          
          {/* Location Relevance */}
          <div className="mt-4 p-3 bg-primary-bg/30 rounded border-l-2 border-primary/50">
            <div className="flex items-start">
              <Target size={14} className="text-primary mt-0.5 mr-1.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary">{locationImpact}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Tab Navigation */}
        <div className="w-full mb-4">
          <div className="flex border-b border-border">
            <motion.button
              className={`flex items-center px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'content'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('content')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content
              {activeTab === 'content' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTabIndicator"
                />
              )}
            </motion.button>
            <motion.button
              className={`flex items-center px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'summary'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('summary')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Cpu className="h-4 w-4 mr-2" />
              AI Summary
              {activeTab === 'summary' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTabIndicator"
                />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'content' && (
              <motion.div 
                className="prose dark:prose-invert prose-sm max-w-none text-text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                key="content-tab"
              >
                <p className="leading-relaxed mb-4">{article.content || article.description}</p>
                
                {/* Read more link */}
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Read full article
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </motion.div>
            )}
            
            {activeTab === 'summary' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                key="summary-tab"
              >
                <motion.div 
                  className="p-5 rounded-lg bg-primary-bg/30 border border-border shadow-elevation-1 text-text-primary relative overflow-hidden"
                  whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-secondary/30"></div>
                  <h3 className="font-medium text-primary mb-2 flex items-center">
                    <Cpu size={16} className="mr-2" />
                    AI Generated Summary
                  </h3>
                  <p className="text-sm leading-relaxed">
                    {article.aiSummary || "AI summary not available for this article."}
                  </p>
                </motion.div>
                
                {!fullSummary && !loadingSummary && article.aiSummary && (
                  <motion.button
                    className="px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-elevation-1 hover:shadow-elevation-2"
                    onClick={loadFullSummary}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate Full AI Analysis
                  </motion.button>
                )}
                
                {loadingSummary && (
                  <div className="flex items-center space-x-3 text-text-primary p-4 bg-primary-bg/20 rounded-lg">
                    <div className="animate-pulse w-5 h-5 rounded-full bg-primary/50"></div>
                    <p>Generating comprehensive analysis...</p>
                  </div>
                )}
                
                {fullSummary && (
                  <motion.div 
                    className="p-5 rounded-lg bg-primary-bg/30 border border-border shadow-elevation-1 text-text-primary relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2, boxShadow: 'var(--elevation-2)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue/30 to-primary/30"></div>
                    <h3 className="font-medium text-primary mb-2 flex items-center">
                      <Cpu size={16} className="mr-2" />
                      Comprehensive Analysis
                    </h3>
                    <p className="text-sm leading-relaxed">{fullSummary}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Article Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-6 mt-8 border-t border-border">
          <div className="flex items-center space-x-3">
            {onSave && (
              <motion.button
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-bg hover:bg-primary-bg-light transition-all text-text-primary shadow-elevation-1 hover:shadow-elevation-2"
                onClick={() => onSave(article.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Bookmark className="h-4 w-4 mr-2 text-primary" />
                Save
              </motion.button>
            )}
            
            {onShare && (
              <motion.button
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-bg hover:bg-primary-bg-light transition-all text-text-primary shadow-elevation-1 hover:shadow-elevation-2"
                onClick={() => onShare(article)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="h-4 w-4 mr-2 text-primary" />
                Share
              </motion.button>
            )}
          </div>
          
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground transition-all shadow-elevation-1 hover:shadow-elevation-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Original
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
} 