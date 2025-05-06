import { supabase } from './supabase';
import axios from 'axios';

export interface Article {
  id: string;
  title: string;
  category: string;
  source: string;
  url?: string;
  imageUrl?: string;
  summary: string;
  content?: string;
  description?: string;
  publishedAt: string;
  relevanceReason?: string;
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  location: string;
}

// News API sources
const NEWS_API_SOURCES = {
  THENEWSAPI: 'https://api.thenewsapi.com/v1/news',
  NEWSDATA: 'https://newsdata.io/api/1/news',
  NEWSAPI: 'https://newsapi.org/v2',
  APITUBE: 'https://api.apitube.io/v1/news'
};

// Function to get real articles from multiple APIs
export async function getArticles(category: string | null = null): Promise<Article[]> {
  try {
    // First, try to get articles from the TheNewsAPI
    try {
      const articles = await fetchFromTheNewsAPI(category);
      if (articles.length > 0) {
        return articles;
      }
    } catch (error) {
      console.error('Error fetching from TheNewsAPI:', error);
    }

    // If that fails, try NewsData.io
    try {
      const articles = await fetchFromNewsDataIO(category);
      if (articles.length > 0) {
        return articles;
      }
    } catch (error) {
      console.error('Error fetching from NewsData.io:', error);
    }

    // If all APIs fail, use mock data as fallback
    console.warn('All news APIs failed, using mock data as fallback');
    return getFilteredMockArticles(category);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return getFilteredMockArticles(category);
  }
}

// Function to fetch news from TheNewsAPI
async function fetchFromTheNewsAPI(category: string | null = null): Promise<Article[]> {
  let endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/top`;
  let params: any = {
    api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
    language: 'en',
    limit: 10
  };

  if (category && category !== 'All') {
    const categoryMap: { [key: string]: string } = {
      'Technology': 'tech',
      'Business': 'business',
      'Politics': 'politics',
      'Science': 'science',
      'Health': 'health',
      'Sports': 'sports',
      'Entertainment': 'entertainment',
      'World News': 'world'
    };
    
    params.categories = categoryMap[category] || 'general';
  }

  const response = await axios.get(endpoint, { params });
  
  if (response.data && response.data.data && response.data.data.length > 0) {
    return response.data.data.map((item: any) => ({
      id: item.uuid || item.id || String(Math.random()),
      title: item.title,
      category: category || mapCategoryFromKeywords(item.keywords || []),
      source: item.source || 'TheNewsAPI',
      url: item.url,
      imageUrl: item.image_url,
      summary: item.description || item.snippet,
      content: item.content || item.snippet,
      description: item.description || item.snippet,
      publishedAt: item.published_at || new Date().toISOString(),
    }));
  }
  
  return [];
}

// Function to fetch news from NewsData.io
async function fetchFromNewsDataIO(category: string | null = null): Promise<Article[]> {
  let endpoint = `${NEWS_API_SOURCES.NEWSDATA}`;
  let params: any = {
    apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
    language: 'en',
    size: 10
  };

  if (category && category !== 'All') {
    const categoryMap: { [key: string]: string } = {
      'Technology': 'technology',
      'Business': 'business',
      'Politics': 'politics',
      'Science': 'science',
      'Health': 'health',
      'Sports': 'sports',
      'Entertainment': 'entertainment',
      'World News': 'world'
    };
    
    params.category = categoryMap[category] || 'top';
  }

  const response = await axios.get(endpoint, { params });
  
  if (response.data && response.data.results && response.data.results.length > 0) {
    return response.data.results.map((item: any) => ({
      id: item.article_id || String(Math.random()),
      title: item.title,
      category: category || mapCategoryFromKeywords(item.keywords || []),
      source: item.source_id || 'NewsData.io',
      url: item.link,
      imageUrl: item.image_url,
      summary: item.description || item.content,
      content: item.content,
      description: item.description,
      publishedAt: item.pubDate || new Date().toISOString(),
    }));
  }
  
  return [];
}

// Helper to map keywords to categories
function mapCategoryFromKeywords(keywords: string[]): string {
  const categoryKeywords = {
    'Technology': ['tech', 'technology', 'digital', 'software', 'hardware', 'ai', 'artificial intelligence'],
    'Business': ['business', 'finance', 'economy', 'market', 'stock', 'trade'],
    'Politics': ['politics', 'government', 'election', 'policy', 'political'],
    'Science': ['science', 'research', 'discovery', 'study', 'scientific'],
    'Health': ['health', 'medical', 'medicine', 'disease', 'healthcare', 'wellness'],
    'Sports': ['sports', 'football', 'soccer', 'baseball', 'basketball', 'tennis', 'olympics'],
    'Entertainment': ['entertainment', 'movie', 'music', 'celebrity', 'film', 'tv', 'show'],
    'World News': ['world', 'international', 'global', 'foreign', 'diplomatic']
  };

  for (const [category, words] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (words.some(word => keyword.toLowerCase().includes(word))) {
        return category;
      }
    }
  }

  return 'General';
}

// Filtered mock articles as fallback
function getFilteredMockArticles(category: string | null = null): Article[] {
  const allArticles = getMockArticles();
  if (!category || category === 'All') {
    return allArticles;
  }
  return allArticles.filter(article => article.category === category);
}

// Search articles
export const searchArticles = async (query: string): Promise<Article[]> => {
  try {
    // Try to search with TheNewsAPI
    try {
      const endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/all`;
      const params: any = {
        api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
        language: 'en',
        search: query,
        limit: 20
      };

      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data.map((item: any) => ({
          id: item.uuid || item.id || String(Math.random()),
          title: item.title,
          category: mapCategoryFromKeywords(item.keywords || []),
          source: item.source || 'TheNewsAPI',
          url: item.url,
          imageUrl: item.image_url,
          summary: item.description || item.snippet,
          content: item.content || item.snippet,
          description: item.description || item.snippet,
          publishedAt: item.published_at || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error('Error searching TheNewsAPI:', error);
    }

    // Try to search with NewsData.io as backup
    try {
      const endpoint = `${NEWS_API_SOURCES.NEWSDATA}`;
      const params: any = {
        apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
        language: 'en',
        q: query,
        size: 20
      };

      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        return response.data.results.map((item: any) => ({
          id: item.article_id || String(Math.random()),
          title: item.title,
          category: mapCategoryFromKeywords(item.keywords || []),
          source: item.source_id || 'NewsData.io',
          url: item.link,
          imageUrl: item.image_url,
          summary: item.description || item.content,
          content: item.content,
          description: item.description,
          publishedAt: item.pubDate || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error('Error searching NewsData.io:', error);
    }

    // If all APIs fail, search through mock data
    const mockArticles = getMockArticles();
    const searchTerms = query.toLowerCase().split(' ');
    
    return mockArticles.filter(article => {
      const titleMatches = searchTerms.some(term => 
        article.title.toLowerCase().includes(term)
      );
      
      const summaryMatches = searchTerms.some(term => 
        article.summary.toLowerCase().includes(term)
      );
      
      const contentMatches = article.content ? searchTerms.some(term => 
        article.content!.toLowerCase().includes(term)
      ) : false;
      
      const categoryMatches = searchTerms.some(term => 
        article.category.toLowerCase().includes(term)
      );
      
      return titleMatches || summaryMatches || contentMatches || categoryMatches;
    });
  } catch (error) {
    console.error('Error in searchArticles:', error);
    return [];
  }
};

// Save user preferences
export const saveUserPreferences = async (userId: string, preferences: UserPreferences): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: userId,
        categories: preferences.categories,
        sources: preferences.sources,
        location: preferences.location,
        updated_at: new Date().toISOString()
      });

    return { success: !error, error };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error };
  }
};

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<{ preferences: UserPreferences | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return { preferences: null, error };
    }

    return { 
      preferences: data ? {
        categories: data.categories,
        sources: data.sources,
        location: data.location
      } : null, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return { preferences: null, error };
  }
};

// Mock data function - will be used as fallback when APIs fail
export const getMockArticles = (): Article[] => {
  return [
    {
      id: '1',
      title: 'Breakthrough in Quantum Computing Promises Faster Processing',
      summary: 'Scientists have achieved a quantum computing breakthrough that could revolutionize data processing speeds.',
      content: 'Researchers at MIT have successfully demonstrated a new quantum computing architecture that maintains coherence for record durations, potentially allowing for complex calculations that would take traditional computers millennia to solve.',
      source: 'Tech Horizons',
      url: 'https://example.com/quantum-breakthrough',
      publishedAt: '2023-06-15T09:30:00Z',
      category: 'Technology',
      imageUrl: 'https://source.unsplash.com/random/800x600/?quantum',
      relevanceReason: 'Based on your interest in computing technologies',
    },
    {
      id: '2',
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders have reached a consensus on ambitious climate goals at the latest summit.',
      content: 'After intense negotiations, representatives from 195 countries have agreed to more stringent carbon emission targets and substantial funding for renewable energy infrastructure in developing nations.',
      source: 'Global News Network',
      url: 'https://example.com/climate-agreement',
      publishedAt: '2023-06-14T18:45:00Z',
      category: 'World News',
      imageUrl: 'https://source.unsplash.com/random/800x600/?climate',
      relevanceReason: 'Trending in your area',
    },
    {
      id: '3',
      title: 'New Study Links Exercise to Improved Brain Function',
      summary: 'Research indicates that regular physical activity has more cognitive benefits than previously understood.',
      content: 'A longitudinal study spanning 10 years has found that participants who engaged in moderate exercise at least three times weekly showed significantly improved memory retention and problem-solving capabilities compared to sedentary counterparts.',
      source: 'Health Today',
      url: 'https://example.com/exercise-brain-study',
      publishedAt: '2023-06-13T14:20:00Z',
      category: 'Health',
      imageUrl: 'https://source.unsplash.com/random/800x600/?exercise',
      relevanceReason: 'Based on your recent reading history',
    },
    {
      id: '4',
      title: 'Major Business Merger Creates New Market Leader',
      summary: 'Two industry giants announced a surprising merger that will reshape the competitive landscape.',
      content: 'The unexpected merger between two leading corporations is expected to create significant market disruption and may trigger regulatory reviews in multiple jurisdictions due to potential antitrust concerns.',
      source: 'Business Insider',
      url: 'https://example.com/business-merger',
      publishedAt: '2023-06-12T10:15:00Z',
      category: 'Business',
      imageUrl: 'https://source.unsplash.com/random/800x600/?business',
      relevanceReason: 'Related to your followed industries',
    },
    {
      id: '5',
      title: 'Upcoming Elections: Key Issues and Candidates',
      summary: 'Analysis of the main policy debates and leading candidates in the upcoming national elections.',
      content: 'Political analysts point to economic recovery, healthcare reform, and climate policy as the decisive factors likely to influence voter decisions in what is projected to be one of the most closely contested elections in recent history.',
      source: 'Politics Daily',
      url: 'https://example.com/election-preview',
      publishedAt: '2023-06-11T09:00:00Z',
      category: 'Politics',
      imageUrl: 'https://source.unsplash.com/random/800x600/?election',
      relevanceReason: 'Important events in your region',
    },
    {
      id: '6',
      title: 'Astronomical Discovery: New Exoplanet Could Support Life',
      summary: 'Astronomers have identified a potentially habitable exoplanet within our stellar neighborhood.',
      content: 'The newly discovered exoplanet, located just 40 light-years from Earth, resides in its star\'s habitable zone and appears to have an atmosphere containing water vapor, making it one of the most promising candidates for extraterrestrial life found to date.',
      source: 'Space & Cosmos',
      url: 'https://example.com/habitable-exoplanet',
      publishedAt: '2023-06-10T16:20:00Z',
      category: 'Science',
      imageUrl: 'https://source.unsplash.com/random/800x600/?planets',
      relevanceReason: 'Matches your interest in astronomy',
    },
    {
      id: '7',
      title: 'Championship Finals Set After Dramatic Semifinal Matches',
      summary: 'Unexpected results in the semifinals have set up an intriguing championship final matchup.',
      content: 'The underdog team\'s surprise victory has created tremendous excitement among fans worldwide, with ticket prices for the final match reaching record levels and broadcasting rights being negotiated for unprecedented amounts.',
      source: 'Sports Center',
      url: 'https://example.com/championship-finals',
      publishedAt: '2023-06-09T22:30:00Z',
      category: 'Sports',
      imageUrl: 'https://source.unsplash.com/random/800x600/?championship',
      relevanceReason: 'Based on teams you follow',
    },
    {
      id: '8',
      title: 'Award-Winning Film Director Announces Ambitious New Project',
      summary: 'The acclaimed filmmaker revealed plans for a groundbreaking new cinematic experience.',
      content: 'The highly anticipated project will utilize cutting-edge technology to create an immersive narrative experience, pushing the boundaries of traditional filmmaking and potentially establishing a new paradigm for storytelling in digital media.',
      source: 'Entertainment Weekly',
      url: 'https://example.com/director-new-project',
      publishedAt: '2023-06-08T12:15:00Z',
      category: 'Entertainment',
      imageUrl: 'https://source.unsplash.com/random/800x600/?cinema',
      relevanceReason: 'Similar to content you\'ve engaged with',
    }
  ];
}; 