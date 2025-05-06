import { supabase } from './supabase';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  imageUrl?: string;
  relevanceReason?: string;
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  location: string;
}

// Mock data function - will be replaced with actual API calls
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
      category: 'Environment',
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
  ];
};

// Get articles from the database
export const getArticles = async (preferences?: UserPreferences): Promise<Article[]> => {
  try {
    // If in development or testing, return mock data
    if (process.env.NODE_ENV === 'development' || !preferences) {
      return getMockArticles();
    }

    // In a real implementation, we would fetch from Supabase or an external API
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .in('category', preferences.categories || [])
      .order('publishedAt', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching articles:', error);
      return getMockArticles();
    }

    return data as Article[];
  } catch (error) {
    console.error('Error in getArticles:', error);
    return getMockArticles();
  }
};

// Search articles
export const searchArticles = async (query: string, preferences?: UserPreferences): Promise<Article[]> => {
  try {
    // For development/demo purposes, search through mock data
    if (process.env.NODE_ENV === 'development' || !preferences) {
      const mockArticles = getMockArticles();
      const searchTerms = query.toLowerCase().split(' ');
      
      return mockArticles.filter(article => {
        const titleMatches = searchTerms.some(term => 
          article.title.toLowerCase().includes(term)
        );
        
        const summaryMatches = searchTerms.some(term => 
          article.summary.toLowerCase().includes(term)
        );
        
        const contentMatches = searchTerms.some(term => 
          article.content.toLowerCase().includes(term)
        );
        
        const categoryMatches = searchTerms.some(term => 
          article.category.toLowerCase().includes(term)
        );
        
        return titleMatches || summaryMatches || contentMatches || categoryMatches;
      });
    }

    // In a real implementation, we would use full-text search in Supabase
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .textSearch('title', query)
      .order('publishedAt', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return data as Article[];
  } catch (error) {
    console.error('Error in searchArticles:', error);
    return [];
  }
};

// Save user preferences
export const saveUserPreferences = async (userId: string, preferences: UserPreferences): Promise<{ success: boolean; error: any }> => {
  try {
    const { data, error } = await supabase
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