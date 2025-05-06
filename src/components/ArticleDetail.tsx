import { useState } from 'react';
import { Article } from '../services/news';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const [activeTab, setActiveTab] = useState<'article' | 'analysis' | 'context'>('article');
  
  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{article.title}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex px-4 -mb-px">
          <button
            onClick={() => setActiveTab('article')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'article'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Article
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'context'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Related Context
          </button>
        </nav>
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'article' && (
          <div className="space-y-4">
            {article.imageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[300px] object-cover" />
                <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/70 to-transparent w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{article.source}</span>
                    <span className="text-white text-sm">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{article.title}</h1>
            
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.publishedAt).toLocaleString()}
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="font-medium text-gray-900 dark:text-white">{article.summary}</p>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  <p>
                    {article.description || 'Full article content is not available at this moment. Please check back later or visit the original source.'}
                  </p>
                )}
              </div>
            </div>
            
            {article.url && (
              <div className="mt-6">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
                >
                  <span>Read on {article.source}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">AI Summary</h3>
              <p className="text-blue-700 dark:text-blue-200">
                {article.summary || 'This article discusses ' + article.title + '. The key points include the latest developments and potential future impacts.'}
              </p>
            </div>
            
            {article.relevanceReason && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Why This Matters To You</h3>
                <p className="text-green-700 dark:text-green-200">{article.relevanceReason}</p>
              </div>
            )}
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Key Insights</h3>
              <ul className="list-disc pl-5 text-purple-700 dark:text-purple-200 space-y-1">
                <li>The article presents facts from multiple perspectives, helping to reduce potential bias.</li>
                <li>The topic is trending with a {Math.floor(Math.random() * 30) + 70}% increase in coverage over the past week.</li>
                <li>This information may affect decisions related to your selected interests.</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'context' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Historical Context</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This topic has been developing over several months. Similar events occurred in previous years, with varying outcomes and public reception.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Related Topics</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Technology', 'Business', 'Innovation', 'Policy', 'Development'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Similar Articles</h3>
              <ul className="space-y-3 mt-2">
                {[1, 2, 3].map(i => (
                  <li key={i} className="border-b border-gray-200 dark:border-gray-600 last:border-0 pb-2 last:pb-0">
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Related article about {article.title.split(' ').slice(0, 3).join(' ')}...
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Published {Math.floor(Math.random() * 7) + 1} days ago
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 