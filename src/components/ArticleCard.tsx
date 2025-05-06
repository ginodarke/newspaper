import { useState } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';
import ArticleDetail from './ArticleDetail';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200 h-full flex flex-col"
      >
        {article.imageUrl && (
          <div 
            className="cursor-pointer h-48 overflow-hidden"
            onClick={handleOpenDetail}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div 
              className="cursor-pointer"
              onClick={handleOpenDetail}
            >
              <h2 className="text-lg font-bold hover:text-blue-500 dark:hover:text-blue-400 line-clamp-2">{article.title}</h2>
            </div>
            
            {article.category && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-md ml-2 flex-shrink-0">
                {article.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>{article.source}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          
          <p className="mt-1 text-gray-700 dark:text-gray-300 line-clamp-3 text-sm">
            {article.summary || article.description}
          </p>
          
          {article.relevanceReason && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
              <strong>Why this matters:</strong> {article.relevanceReason}
            </div>
          )}
          
          <div className="mt-auto pt-4 flex justify-between items-center">
            <button 
              onClick={handleOpenDetail}
              className="text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              Read more
            </button>
          </div>
        </div>
      </motion.div>

      {isDetailOpen && (
        <ArticleDetail 
          article={article} 
          onClose={handleCloseDetail} 
        />
      )}
    </>
  );
} 