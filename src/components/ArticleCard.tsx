import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Share2, Clock, Eye } from 'lucide-react';
import { Article } from '../types';
import { cn } from '../lib/utils';

export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
  onSave?: (id: string) => Promise<void>;
  onShare?: (id: string) => Promise<void>;
  isSaved?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'default',
  onSave,
  onShare,
  isSaved = false,
}: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      politics: 'bg-blue-600',
      technology: 'bg-purple-600',
      entertainment: 'bg-pink-600',
      sports: 'bg-green-600',
      business: 'bg-amber-600',
      health: 'bg-red-600',
      local: 'bg-teal-600',
      science: 'bg-indigo-600',
      world: 'bg-orange-600'
    };
    return colors[category.toLowerCase()] || 'bg-slate-600';
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all",
        variant === 'featured' ? 'col-span-2' : '',
        isHovered && 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={article.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
            alt={article.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium text-white rounded-full',
                getCategoryColor(article.category)
              )}
            >
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>{article.readTime || '5'} min read</span>
            <span>•</span>
            <Eye className="h-4 w-4" />
            <span>{article.views || '0'} views</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {article.description}
          </p>

          <div className="flex items-center space-x-2 mb-4">
            <img
              src={article.author?.avatar || 'https://placehold.co/100?text=A'}
              alt={article.author?.name || 'Author'}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{article.author?.name || 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSave?.(article.id);
                }}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isSaved
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                aria-label={isSaved ? 'Remove from saved' : 'Save article'}
              >
                <Bookmark
                  className={cn('h-5 w-5', isSaved && 'fill-current')}
                />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onShare?.(article.id);
                }}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Share article"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              Source: {article.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 