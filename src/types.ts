export interface Article {
  id: string;
  title: string;
  description?: string;
  content?: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  category?: string;
  relevanceReason?: string;
  aiSummary?: string;
  aiAnalysis?: string;
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