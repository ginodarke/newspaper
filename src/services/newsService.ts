import { Article, UserPreferences } from '../types';
import { supabase } from './supabaseClient';

// Mock data for testing
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Scientists Discover New Species in Amazon Rainforest',
    description: 'A team of researchers has found a previously unknown species of frog in the Amazon rainforest.',
    summary: 'Researchers have discovered a new frog species in the Amazon that can change color based on its surroundings, potentially providing insights into evolutionary adaptations.',
    url: 'https://example.com/article1',
    imageUrl: 'https://source.unsplash.com/random/800x600/?rainforest',
    source: 'Nature Today',
    publishedAt: '2023-09-15T10:30:00Z',
    category: 'Science',
    relevanceReason: 'This relates to your interest in environmental conservation.'
  },
  {
    id: '2',
    title: 'AI Model Predicts Climate Change Patterns with 95% Accuracy',
    description: 'New AI system outperforms traditional models in forecasting climate trends.',
    summary: 'A new artificial intelligence system developed by climate scientists has demonstrated the ability to predict climate change patterns with unprecedented accuracy, potentially revolutionizing how we approach environmental policies.',
    url: 'https://example.com/article2',
    imageUrl: 'https://source.unsplash.com/random/800x600/?climate',
    source: 'Tech Science',
    publishedAt: '2023-09-14T14:15:00Z',
    category: 'Technology',
    relevanceReason: 'Based on your interest in AI and environmental topics.'
  },
  {
    id: '3',
    title: 'Global Economy Faces Uncertainty Amid Rising Inflation Rates',
    description: 'Economists warn of potential recession as inflation continues to rise worldwide.',
    summary: 'Economic experts are expressing concern over the global economic outlook as inflation rates continue to climb across major economies, with central banks struggling to implement effective monetary policies.',
    url: 'https://example.com/article3',
    imageUrl: 'https://source.unsplash.com/random/800x600/?economy',
    source: 'Financial Times',
    publishedAt: '2023-09-13T09:45:00Z',
    category: 'Business',
    relevanceReason: 'This is trending in your region and relates to global economic trends.'
  }
];

/**
 * Fetches news articles based on user preferences
 */
export const fetchNews = async (preferences?: UserPreferences): Promise<Article[]> => {
  // In a real implementation, we would call an actual news API with the user's preferences
  // For now, we'll return mock data with a slight delay to simulate an API call
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For a real implementation, we would use:
    // const { data, error } = await supabase
    //   .from('articles')
    //   .select('*')
    //   .order('publishedAt', { ascending: false });
    
    // if (error) throw error;
    // return data as Article[];
    
    return mockArticles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

/**
 * Searches for news articles based on a query
 */
export const searchNews = async (query: string, preferences?: UserPreferences): Promise<Article[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock data based on query (case-insensitive)
    const normalizedQuery = query.toLowerCase();
    const filteredArticles = mockArticles.filter(article => 
      article.title.toLowerCase().includes(normalizedQuery) ||
      (article.description && article.description.toLowerCase().includes(normalizedQuery)) ||
      (article.summary && article.summary.toLowerCase().includes(normalizedQuery)) ||
      article.category?.toLowerCase().includes(normalizedQuery) ||
      article.source.toLowerCase().includes(normalizedQuery)
    );
    
    // For a real implementation with Supabase, we would use full-text search:
    // const { data, error } = await supabase
    //   .from('articles')
    //   .select('*')
    //   .textSearch('content', query)
    //   .order('publishedAt', { ascending: false });
    
    // if (error) throw error;
    // return data as Article[];
    
    return filteredArticles;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

/**
 * Fetches a single article by ID
 */
export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const article = mockArticles.find(article => article.id === id);
    
    // For a real implementation with Supabase:
    // const { data, error } = await supabase
    //   .from('articles')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (error) throw error;
    // return data as Article;
    
    return article || null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
}; 