import { useState } from 'react';
import { Article } from '../types';
import { getAISummary } from '../services/news';
import { Clock, Eye, Share2, Bookmark } from 'lucide-react';

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

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{article.category}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{article.source}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{article.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{article.views} views</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold">{article.title}</h1>

        <div className="flex items-center space-x-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full rounded-lg object-cover"
        />

        <div className="w-full">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'content'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'summary'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              AI Summary
            </button>
          </div>
          
          {activeTab === 'content' && (
            <div className="mt-4 prose prose-sm max-w-none">
              <p>{article.content}</p>
            </div>
          )}
          
          {activeTab === 'summary' && (
            <div className="mt-4 space-y-4">
              <p className="text-muted-foreground">{article.aiSummary}</p>
              {!fullSummary && !loadingSummary && (
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={loadFullSummary}
                >
                  Load Full Summary
                </button>
              )}
              {loadingSummary && <p>Loading full summary...</p>}
              {fullSummary && (
                <div className="prose prose-sm max-w-none">
                  <p>{fullSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center px-3 py-1 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => onSave?.(article.id)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              className="inline-flex items-center px-3 py-1 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => onShare?.(article)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Read original article
          </a>
        </div>
      </div>
    </div>
  );
} 