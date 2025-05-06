import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, getAISummary } from '../services/news';

export interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  onExpandClick: () => void;
  isExpanded: boolean;
}

export default function ArticleCard({ article, onClick, onExpandClick, isExpanded }: ArticleCardProps) {
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAISummary] = useState<string | null>(article.aiSummary || null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSummaryClick = async () => {
    if (!aiSummary && !loadingAI) {
      setLoadingAI(true);
      try {
        const summary = await getAISummary(article);
        setAISummary(summary);
      } catch (error) {
        console.error("Error getting AI summary:", error);
      } finally {
        setLoadingAI(false);
      }
    }
    setShowAISummary(!showAISummary);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        {article.imageUrl ? (
          <div className="relative h-48 cursor-pointer" onClick={onClick}>
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center cursor-pointer" onClick={onClick}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v10a2 2 0 002 2h5zM2 10h8" />
            </svg>
          </div>
        )}
        
        {/* Category and Local News Badge */}
        <div className="absolute top-0 right-0 flex gap-2 m-2">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
            {article.category}
          </span>
          {article.isLocalNews && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Local
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="cursor-pointer" onClick={onClick}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
            {article.title}
          </h2>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{article.source}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
          {article.summary}
        </p>
        
        {/* Relevance Information */}
        {article.relevanceReason && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <strong className="font-medium block mb-1">Why this matters to you:</strong>
                <p>{article.relevanceReason}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={onExpandClick}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline focus:outline-none flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
            </svg>
            {isExpanded ? 'Hide context' : 'Show context'}
          </button>
          
          <button 
            onClick={onClick}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline focus:outline-none flex items-center"
          >
            <span>Read full article</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
        
        {/* AI Summary Button */}
        <div className="mt-2">
          <button
            onClick={handleSummaryClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={loadingAI}
          >
            {loadingAI ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Summary...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {showAISummary ? "Hide AI Summary" : "Get AI Summary"}
              </>
            )}
          </button>
        </div>
        
        {/* AI Summary Section */}
        <AnimatePresence>
          {showAISummary && aiSummary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-sm"
            >
              <div className="flex items-start gap-2 mb-1">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <strong className="font-semibold">AI Summary:</strong>
              </div>
              <p className="pl-6">{aiSummary}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Expanded Context Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600"
            >
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Additional Context
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {article.content || 'This topic has been developing over the last few months. Experts suggest this could have significant implications for future developments in this field.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 