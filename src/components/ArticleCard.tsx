import { motion } from 'framer-motion';
import { Article } from '../services/news';

export interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  onExpandClick: () => void;
  isExpanded: boolean;
}

export default function ArticleCard({ article, onClick, onExpandClick, isExpanded }: ArticleCardProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
      >
        {article.imageUrl && (
          <div className="relative h-48 cursor-pointer" onClick={onClick}>
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0 m-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                {article.category}
              </span>
            </div>
          </div>
        )}
        
        <div className="p-4">
          <div className="cursor-pointer" onClick={onClick}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
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
          
          {article.relevanceReason && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm">
              <strong>Why this matters to you:</strong> {article.relevanceReason}
            </div>
          )}
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={onExpandClick}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline focus:outline-none"
            >
              {isExpanded ? 'Hide context' : 'Show context'}
            </button>
            
            <button 
              onClick={onClick}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline focus:outline-none"
            >
              Read full article
            </button>
          </div>
          
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Additional Context</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {article.content || 'This topic has been developing over the last few months. Experts suggest this could have significant implications for future developments in this field.'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
} 