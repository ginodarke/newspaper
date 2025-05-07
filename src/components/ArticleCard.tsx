import { useState } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';
import { getAISummary } from '../services/news';
import LoadingSpinner from './LoadingSpinner';

interface ArticleCardProps {
  article: Article;
  onSave?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  onClick?: () => void;
}

export default function ArticleCard({ article, onSave, onShare, onClick }: ArticleCardProps) {
  const [activeTab, setActiveTab] = useState('article');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    if (value === 'ai' && !aiSummary && !isLoadingSummary) {
      try {
        setIsLoadingSummary(true);
        setSummaryError(null);
        const summary = await getAISummary(article);
        setAiSummary(summary);
      } catch (error) {
        console.error('Error getting AI summary:', error);
        setSummaryError('Failed to get AI summary. Please try again later.');
      } finally {
        setIsLoadingSummary(false);
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString()
    : 'Recently';

  return (
    <div className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border rounded-lg bg-card text-card-foreground shadow" onClick={onClick}>
      <div className="py-4 px-5 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
            {article.source || 'News'}
          </div>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-bold leading-tight line-clamp-2 hover:text-primary transition-colors">
          {article.title}
        </h3>
      </div>
      
      {article.imageUrl && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex-grow p-4">
        <div className="w-full mb-2">
          <div className="grid w-full grid-cols-2 mb-2 border rounded-lg overflow-hidden">
            <button 
              className={`py-2 text-center text-sm ${activeTab === 'article' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => handleTabChange('article')}
            >
              Article
            </button>
            <button 
              className={`py-2 text-center text-sm ${activeTab === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => handleTabChange('ai')}
            >
              AI Summary
            </button>
          </div>
          
          <div className="mt-2 min-h-[80px]">
            {activeTab === 'article' && (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {article.description || 'No description available'}
              </p>
            )}
            
            {activeTab === 'ai' && (
              <>
                {isLoadingSummary ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="small" />
                  </div>
                ) : summaryError ? (
                  <div className="text-sm text-red-500 py-2">{summaryError}</div>
                ) : aiSummary ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {truncateText(aiSummary, 180)}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Click to generate AI summary</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-3 px-5 border-t">
        {onSave && (
          <button 
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onSave(article.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Save
          </button>
        )}
        
        {onShare && (
          <button 
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onShare(article.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </button>
        )}
      </div>
    </div>
  );
} 