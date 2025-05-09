import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../types';
import { Clock, Share2, Bookmark, ExternalLink, FileText, Cpu, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
  isMainFeatured?: boolean;
  withBorder?: boolean;
}

export default function ArticleCard({ article, isMainFeatured = false, withBorder = true }: ArticleCardProps) {
  const [activeTab, setActiveTab] = useState<'article' | 'ai'>('article');
  const [isPersonalEffectOpen, setIsPersonalEffectOpen] = useState(false);

  const formattedDate = article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) 
    : 'Recently';

  const generatePersonalEffect = (article: Article) => {
    // This would ideally come from an AI service based on user profile
    // For now, we'll generate it based on article category and content
    const category = article.category || "general";
    
    const effects = {
      business: "This could impact your investments or career opportunities in related sectors.",
      technology: "This technology trend might affect your digital lifestyle or future tech purchases.",
      entertainment: "This content might influence your entertainment choices or social conversations.",
      sports: "This could affect your favorite teams or upcoming sports events you follow.",
      health: "These health findings might be relevant to your wellness routine or medical considerations.",
      science: "These scientific developments could shape future technologies you'll interact with.",
      general: "This news may affect your general awareness and perspectives on current events."
    };
    
    return effects[category as keyof typeof effects] || effects.general;
  };

  return (
    <motion.div 
      className={`bg-card rounded-xl ${withBorder ? 'border border-border' : ''} overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title || 'Article image'} 
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
            onError={(e) => (e.currentTarget.src = '/placeholder-news.jpg')}
          />
          {article.source && (
            <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
              {article.source}
            </span>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col p-4">
        {/* Article Header */}
        <div className="mb-3">
          <h3 className={`font-bold tracking-tight text-foreground ${isMainFeatured ? 'text-2xl' : 'text-xl'} leading-tight`}>
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-3">
          <button 
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'article' 
                ? 'text-primary border-b-2 border-primary -mb-px' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={() => setActiveTab('article')}
          >
            <FileText className="w-4 h-4 mr-1" />
            Article
          </button>
          <button 
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'ai' 
                ? 'text-primary border-b-2 border-primary -mb-px' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            <Cpu className="w-4 h-4 mr-1" />
            AI Summary
          </button>
        </div>

        {/* Content */}
        <div className="mb-4 flex-1">
          {activeTab === 'article' ? (
            <p className="text-foreground text-sm">
              {article.description || 'No description available for this article.'}
            </p>
          ) : (
            <div className="bg-secondary/5 p-3 rounded-md border border-secondary/10 text-sm">
              {article.aiSummary ? (
                <p className="text-foreground">{article.aiSummary}</p>
              ) : (
                <div className="text-muted-foreground italic flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  AI summary not available for this article.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Personal Effect Section */}
        <div className="mt-auto">
          <button 
            onClick={() => setIsPersonalEffectOpen(!isPersonalEffectOpen)}
            className="w-full flex items-center justify-between text-sm py-2 px-3 bg-primary/5 hover:bg-primary/10 rounded-md text-primary transition-colors"
          >
            <div className="flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              <span>Personal Effect</span>
            </div>
            {isPersonalEffectOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {isPersonalEffectOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 bg-background border border-border rounded-md text-sm text-muted-foreground">
                  {generatePersonalEffect(article)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Read Full Article
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
} 