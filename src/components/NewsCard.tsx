import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  onClick?: () => void;
  onSave?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'featured';
}

export default function NewsCard({
  article,
  onClick,
  onSave,
  onShare,
  featured = false,
  size = 'medium',
  variant = 'default'
}: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the date
  const formattedDate = article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) 
    : 'Recently';
  
  // Generate a color for the category badge based on the category name
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      business: 'bg-primary/80 text-primary-foreground',
      technology: 'bg-blue-500/80 text-white',
      entertainment: 'bg-purple-500/80 text-white',
      sports: 'bg-green-500/80 text-white',
      health: 'bg-red-500/80 text-white',
      science: 'bg-indigo-500/80 text-white',
      politics: 'bg-orange-500/80 text-white',
      world: 'bg-teal-500/80 text-white',
      general: 'bg-gray-500/80 text-white',
    };
    
    return categories[category?.toLowerCase() || 'general'] || categories.general;
  };
  
  // Size classes
  const sizeClasses = {
    small: 'h-[280px] max-w-[280px]',
    medium: 'h-[350px] max-w-[380px]',
    large: 'h-[400px] max-w-[450px]',
  };
  
  return (
    <motion.div 
      className={`relative cursor-pointer overflow-hidden rounded-lg ${sizeClasses[size]}`}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Card Container with 3D effect */}
      <motion.div
        className="w-full h-full preserve-3d backface-hidden"
        variants={{
          initial: { 
            rotateY: 0,
            rotateX: 0,
            z: 0
          },
          hover: { 
            rotateY: featured ? 2 : 1,
            rotateX: featured ? -1 : -0.5,
            z: 20,
            transition: { 
              type: 'spring', 
              stiffness: 300, 
              damping: 15
            }
          }
        }}
      >
        {/* Background Layer */}
        <div 
          className="absolute inset-0 rounded-lg bg-card-gradient" 
          style={{ 
            transform: 'translateZ(0px)',
            boxShadow: isHovered ? 'var(--elevation-3)' : 'var(--elevation-1)',
            transition: 'box-shadow 0.3s ease-out'
          }}
        >
          {/* Light effect at top */}
          <div className="absolute inset-x-0 top-0 h-[1px] light-source-top"></div>
          
          {/* Light effect at top-left corner */}
          <div className="absolute top-0 left-0 w-[60%] h-[60%] light-source-top-left opacity-40 rounded-tl-lg"></div>
        </div>
        
        {/* Card Content Layer */}
        <div 
          className="absolute inset-0 flex flex-col p-4 z-10"
          style={{ 
            transform: 'translateZ(2px)'
          }}
        >
          {/* Card Image */}
          {article.imageUrl && (
            <div 
              className="w-full aspect-video overflow-hidden rounded-md relative mb-4" 
              style={{ 
                transform: 'translateZ(5px)'
              }}
            >
              <img 
                src={article.imageUrl} 
                alt={article.title || 'News image'} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-news.jpg';
                }}
              />
              
              {/* Source Badge */}
              {article.source && (
                <motion.div 
                  className="absolute top-2 left-2" 
                  variants={{
                    initial: { opacity: 0.8, scale: 1 },
                    hover: { opacity: 1, scale: 1.05 }
                  }}
                  style={{ 
                    transform: 'translateZ(10px)'
                  }}
                >
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary-bg text-primary">
                    {article.source}
                  </span>
                </motion.div>
              )}
              
              {/* Category Badge */}
              {article.category && (
                <motion.div 
                  className="absolute top-2 right-2" 
                  variants={{
                    initial: { opacity: 0.8, scale: 1 },
                    hover: { opacity: 1, scale: 1.05 }
                  }}
                  style={{ 
                    transform: 'translateZ(10px)'
                  }}
                >
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Card Title */}
          <motion.h3 
            className="text-headline font-bold mb-2 line-clamp-3"
            variants={{
              initial: { y: 0 },
              hover: { y: -2 }
            }}
            style={{ 
              transform: 'translateZ(6px)'
            }}
          >
            {article.title}
          </motion.h3>
          
          {/* Card Description */}
          <motion.p 
            className="text-sm text-text-secondary line-clamp-3 mb-4"
            variants={{
              initial: { opacity: 0.8 },
              hover: { opacity: 1 }
            }}
            style={{ 
              transform: 'translateZ(4px)'
            }}
          >
            {article.description || 'No description available.'}
          </motion.p>
          
          {/* Card Footer */}
          <div className="mt-auto flex justify-between items-center" style={{ transform: 'translateZ(8px)' }}>
            {/* Date */}
            <span className="text-xs text-text-secondary">{formattedDate}</span>
            
            {/* Actions */}
            <div className="flex space-x-2">
              {onSave && (
                <motion.button
                  className="p-1.5 rounded-full bg-primary-bg-light text-primary hover:bg-primary-bg-dark transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave(article.id);
                  }}
                  whileTap={{ scale: 0.95 }}
                  variants={{
                    initial: { opacity: 0.8, y: 0 },
                    hover: { opacity: 1, y: -2 }
                  }}
                >
                  <Bookmark size={16} />
                </motion.button>
              )}
              
              {onShare && (
                <motion.button
                  className="p-1.5 rounded-full bg-primary-bg-light text-primary hover:bg-primary-bg-dark transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(article.id);
                  }}
                  whileTap={{ scale: 0.95 }}
                  variants={{
                    initial: { opacity: 0.8, y: 0 },
                    hover: { opacity: 1, y: -2 }
                  }}
                >
                  <Share2 size={16} />
                </motion.button>
              )}
              
              <motion.a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-primary-bg-light text-primary hover:bg-primary-bg-dark transition-colors"
                onClick={(e) => e.stopPropagation()}
                whileTap={{ scale: 0.95 }}
                variants={{
                  initial: { opacity: 0.8, y: 0 },
                  hover: { opacity: 1, y: -2 }
                }}
              >
                <ExternalLink size={16} />
              </motion.a>
            </div>
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 70%)',
            transform: 'translateZ(1px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
} 