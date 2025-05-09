import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../types';
import { Clock, Share2, Bookmark, ExternalLink, FileText, Cpu, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';

interface ArticleCardProps {
  article: Article;
  isMainFeatured?: boolean;
  withBorder?: boolean;
  onSave?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  onClick?: () => void;
}

export default function ArticleCard({ 
  article, 
  isMainFeatured = false, 
  withBorder = true,
  onSave,
  onShare,
  onClick 
}: ArticleCardProps) {
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
    <Card 
      variant={isMainFeatured ? "gradient" : "default"}
      size="md"
      className="h-full"
      interactive={!!onClick}
      interactive3d={true}
      elevation={isMainFeatured ? 3 : 1}
      onClick={onClick}
    >
      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
          <img 
            src={article.imageUrl} 
            alt={article.title || 'Article image'} 
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
            onError={(e) => (e.currentTarget.src = '/placeholder-news.jpg')}
          />
          {article.source && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-md shadow-lg">
                {article.source}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col p-4">
        {/* Article Header */}
        <CardHeader className={isMainFeatured ? "mb-2" : "mb-0"}>
          <CardTitle className={`${isMainFeatured ? 'text-headline' : 'text-featured'} leading-tight`}>
            {article.title}
          </CardTitle>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="flex border-b border-border mb-3">
          <button 
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'article' 
                ? 'text-primary border-b-2 border-primary -mb-px' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('article');
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('ai');
            }}
          >
            <Cpu className="w-4 h-4 mr-1" />
            AI Summary
          </button>
        </div>

        {/* Content */}
        <CardContent className="mb-4 flex-1">
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
        </CardContent>

        {/* Personal Effect Section */}
        <div className="mt-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsPersonalEffectOpen(!isPersonalEffectOpen);
            }}
            className="w-full flex items-center justify-between text-sm py-2 px-3 bg-accent/30 hover:bg-accent/50 rounded-md text-foreground transition-colors"
          >
            <div className="flex items-center">
              <UserCircle className="w-4 h-4 mr-2 text-primary" />
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
                <div className="mt-2 p-3 bg-background/50 backdrop-blur-sm border border-border rounded-md text-sm">
                  {generatePersonalEffect(article)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <CardFooter className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            {onSave && (
              <button 
                className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(article.id);
                }}
              >
                <Bookmark className="h-4 w-4" />
              </button>
            )}
            
            {onShare && (
              <button 
                className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(article.id);
                }}
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Read Full Article
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </CardFooter>
      </div>
    </Card>
  );
} 