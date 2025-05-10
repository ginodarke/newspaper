export interface Article {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  url: string;
  publishedAt: string;
  category: string;
  source: string;
  isLocalNews?: boolean;
  relevanceReason?: string;
  locationRelevance?: string;
  aiSummary?: string;
  readTime?: number;
  views?: number;
  author?: {
    name: string;
    avatar?: string;
  };
  trendingScore?: number;
  keyFeatures?: string[];
}

export interface Preferences {
  categories: string[];
  sources: string[];
  location?: string;
  interests?: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  preferences?: Preferences;
}

export interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
} 