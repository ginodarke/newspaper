export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  source: string;
  url: string;
  isLocalNews?: boolean;
  relevanceReason?: string;
  locationRelevance?: string;
  aiSummary?: string;
  summary?: string;
  readTime: number;
  views: number;
  keyFeatures?: string[];
  trendingScore?: number;
  author: {
    name: string;
    avatar: string;
  };
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  keywords: string[];
  excludeKeywords: string[];
  location?: string;
}

export interface SearchResult {
  articles: Article[];
  totalResults: number;
} 