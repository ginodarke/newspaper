import { supabase } from './supabase';
import axios from 'axios';
import { LocationData, parseLocationString } from './location';

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
  aiSummary?: string;
  isLocalNews?: boolean;
  keyFeatures?: string[];
  locationRelevance?: string;
  trendingScore?: number;
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

// Constants for article fetching
const ARTICLES_PER_CATEGORY = 10; // Fetch at least 10 articles per category
const DEFAULT_COUNTRY = 'us'; // Default to US news

// Function to get real articles from multiple APIs
export async function getArticles(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  try {
    // Try location-based news first if we have user location and category is null or 'local'
    if (userLocation && (!category || category === 'Local')) {
      try {
        const localArticles = await fetchLocalNews(userLocation);
        if (localArticles.length >= ARTICLES_PER_CATEGORY) {
          return localArticles;
        }
      } catch (error) {
        console.error('Error fetching local news:', error);
      }
    }

    // Then try regular category-based news from TheNewsAPI
    try {
      const articles = await fetchFromTheNewsAPI(category, userLocation);
      if (articles.length >= ARTICLES_PER_CATEGORY) {
        // Add relevance explanations based on location for some articles
        if (userLocation) {
          const articlesWithRelevance = await addRelevanceExplanations(articles, userLocation);
          return articlesWithRelevance;
        }
        return articles;
      }
    } catch (error) {
      console.error('Error fetching from TheNewsAPI:', error);
    }

    // If that fails, try NewsData.io
    try {
      const articles = await fetchFromNewsDataIO(category, userLocation);
      if (articles.length >= ARTICLES_PER_CATEGORY) {
        // Add relevance explanations based on location for some articles
        if (userLocation) {
          const articlesWithRelevance = await addRelevanceExplanations(articles, userLocation);
          return articlesWithRelevance;
        }
        return articles;
      }
    } catch (error) {
      console.error('Error fetching from NewsData.io:', error);
    }

    // If all APIs fail, use mock data as fallback
    console.warn('All news APIs failed, using mock data as fallback');
    let mockArticles = getFilteredMockArticles(category);
    
    // Add mock location relevance to mock articles
    if (userLocation) {
      mockArticles = mockArticles.map((article, index) => {
        if (index % 3 === 0) { // Add relevance reasons to every third article
          return {
            ...article,
            relevanceReason: `This is happening near ${userLocation.city || 'your location'}.`,
            isLocalNews: true,
            locationRelevance: `This news impacts ${userLocation.city || userLocation.region || 'your area'} directly.`
          };
        }
        return article;
      });
    }
    
    return mockArticles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return getFilteredMockArticles(category);
  }
}

// Function to fetch local news based on user location
async function fetchLocalNews(location: LocationData): Promise<Article[]> {
  try {
    // First try NewsData.io with local query
    const city = location.city || '';
    const region = location.region || '';
    const country = location.country || '';
    
    // Create location query
    const locationQuery = [city, region, country].filter(Boolean).join(' ');
    
    // Skip if we don't have enough location data
    if (!locationQuery) {
      return [];
    }
    
    const endpoint = `${NEWS_API_SOURCES.NEWSDATA}`;
    const params: any = {
      apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
      language: 'en',
      q: locationQuery,
      category: 'top',
      size: ARTICLES_PER_CATEGORY
    };

    const response = await axios.get(endpoint, { params });
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      const localArticles = response.data.results.map((item: any) => ({
        id: item.article_id || String(Math.random()),
        title: item.title,
        category: 'Local',
        source: item.source_id || 'NewsData.io',
        url: item.link,
        imageUrl: item.image_url,
        summary: item.description || item.content,
        content: item.content,
        description: item.description,
        publishedAt: item.pubDate || new Date().toISOString(),
        relevanceReason: `This is happening in ${location.city || 'your area'}.`,
        isLocalNews: true,
        locationRelevance: `This directly affects ${location.city || location.region || 'your area'}.`,
        trendingScore: Math.floor(Math.random() * 20) + 80 // High trending score for local news
      }));
      
      return localArticles;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching local news:', error);
    return [];
  }
}

// Function to fetch news from TheNewsAPI
async function fetchFromTheNewsAPI(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  let endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/top`;
  let params: any = {
    api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
    language: 'en',
    limit: ARTICLES_PER_CATEGORY + 5, // Add buffer for filtering
    locale: DEFAULT_COUNTRY, // Default to US news
  };

  if (category && category !== 'All' && category !== 'Local') {
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

  // If we have user location with country, adjust the locale
  if (userLocation && userLocation.country) {
    // Convert country to locale code if possible
    const countryCode = userLocation.country.toLowerCase();
    if (countryCode === 'united states' || countryCode === 'usa' || countryCode === 'us') {
      params.locale = 'us';
    } else if (countryCode === 'united kingdom' || countryCode === 'uk' || countryCode === 'gb') {
      params.locale = 'gb';
    } else if (countryCode === 'canada' || countryCode === 'ca') {
      params.locale = 'ca';
    } else if (countryCode === 'australia' || countryCode === 'au') {
      params.locale = 'au';
    }
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
      trendingScore: Math.floor(Math.random() * 30) + 70, // Random trending score between 70-100
      keyFeatures: extractKeyFeatures(item.description || item.snippet || item.title)
    }));
  }
  
  return [];
}

// Function to fetch news from NewsData.io
async function fetchFromNewsDataIO(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  let endpoint = `${NEWS_API_SOURCES.NEWSDATA}`;
  let params: any = {
    apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
    language: 'en',
    size: ARTICLES_PER_CATEGORY + 5, // Add buffer for filtering
    country: 'us' // Default to US news
  };

  if (category && category !== 'All' && category !== 'Local') {
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

  // If we have user location with country, adjust the country
  if (userLocation && userLocation.country) {
    // Convert country name to country code if necessary
    const countryName = userLocation.country.toLowerCase();
    if (countryName === 'united states' || countryName === 'usa' || countryName === 'us') {
      params.country = 'us';
    } else if (countryName === 'united kingdom' || countryName === 'uk') {
      params.country = 'gb';
    } else if (countryName === 'canada') {
      params.country = 'ca';
    } else if (countryName === 'australia') {
      params.country = 'au';
    }
    // Otherwise keep the default
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
      trendingScore: Math.floor(Math.random() * 30) + 70, // Random trending score between 70-100
      keyFeatures: extractKeyFeatures(item.description || item.content || item.title)
    }));
  }
  
  return [];
}

// Helper to extract key features from article content
function extractKeyFeatures(text: string): string[] {
  if (!text) return [];
  
  // Simple extraction of key features based on sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const keyFeatures = sentences.slice(0, 3).map(s => s.trim());
  
  // If we don't have enough sentences, add generic features
  while (keyFeatures.length < 3) {
    keyFeatures.push("More information available in the full article.");
  }
  
  return keyFeatures;
}

// Helper to add AI-generated summaries and relevance explanations
async function addRelevanceExplanations(articles: Article[], location: LocationData): Promise<Article[]> {
  try {
    // Only process a subset of articles to avoid making too many API calls
    const articlesToProcess = articles.slice(0, ARTICLES_PER_CATEGORY);
    const openrouterApiKey = process.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('OpenRouter API key not found, skipping relevance analysis');
      return articles;
    }

    const processedArticles = await Promise.all(
      articlesToProcess.map(async (article, index) => {
        // Process every article for better user experience
        try {
          const prompt = `
Given the following article, please provide two things:
1. A concise one-sentence explanation (25 words max) of why this news might personally matter to someone living in ${location.city || location.region || 'the provided location'}, ${location.country || ''}.
2. Extract 3-4 key features or important pieces of information from the article as bullet points.

Article Title: ${article.title}
Article Summary: ${article.summary}

Format your response as:
RELEVANCE: [your one-sentence explanation]
FEATURES:
- [first key point]
- [second key point]
- [third key point]
- [optional fourth key point]
`;

          const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              model: 'openai/gpt-3.5-turbo-0125',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              max_tokens: 250
            },
            {
              headers: {
                'Authorization': `Bearer ${openrouterApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content.trim();
            
            // Extract relevance and features from the response
            let relevanceReason = '';
            let keyFeatures: string[] = [];
            
            const relevanceMatch = aiResponse.match(/RELEVANCE:\s*(.*?)(?=\n|$)/);
            if (relevanceMatch && relevanceMatch[1]) {
              relevanceReason = relevanceMatch[1].trim();
            }
            
            const featureMatches = aiResponse.match(/- (.*?)(?=\n|$)/g);
            if (featureMatches) {
              keyFeatures = featureMatches.map((match: string) => match.replace(/^- /, '').trim());
            }
            
            return {
              ...article,
              relevanceReason: relevanceReason || `This ${article.category.toLowerCase()} news could impact ${location.city || 'your area'}'s residents.`,
              keyFeatures: keyFeatures.length > 0 ? keyFeatures : article.keyFeatures || extractKeyFeatures(article.summary),
              aiSummary: `This article highlights ${article.category.toLowerCase()} developments that may affect ${location.city || 'your area'}'s economy, community, or daily life.`
            };
          }
        } catch (error) {
          console.error('Error generating relevance explanation:', error);
        }
        
        return article;
      })
    );

    // Replace the processed articles in the original array
    const result = [...articles];
    processedArticles.forEach((article, index) => {
      if (index < ARTICLES_PER_CATEGORY) {
        result[index] = article;
      }
    });

    return result;
  } catch (error) {
    console.error('Error adding relevance explanations:', error);
    return articles;
  }
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
export const searchArticles = async (query: string, userLocation?: LocationData): Promise<Article[]> => {
  try {
    // Add location context to the search if available
    let locationContext = '';
    if (userLocation && userLocation.city) {
      locationContext = ` ${userLocation.city}`;
    }

    // Try to search with TheNewsAPI
    try {
      const endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/all`;
      const params: any = {
        api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
        language: 'en',
        search: query + locationContext,
        limit: 20
      };

      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const articles = response.data.data.map((item: any) => ({
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
        
        // Add relevance explanations if we have user location
        if (userLocation) {
          return await addRelevanceExplanations(articles, userLocation);
        }
        
        return articles;
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
        q: query + locationContext,
        size: 20
      };

      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        const articles = response.data.results.map((item: any) => ({
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
        
        // Add relevance explanations if we have user location
        if (userLocation) {
          return await addRelevanceExplanations(articles, userLocation);
        }
        
        return articles;
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

// Get user location from preferences
export const getUserLocationFromPreferences = async (userId: string): Promise<LocationData | null> => {
  try {
    const { preferences } = await getUserPreferences(userId);
    if (preferences && preferences.location) {
      return parseLocationString(preferences.location);
    }
    return null;
  } catch (error) {
    console.error('Error getting user location from preferences:', error);
    return null;
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

// Get AI summary for an article
export const getAISummary = async (article: Article): Promise<string> => {
  try {
    const openrouterApiKey = process.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      return "AI summary not available. Please add your OpenRouter API key.";
    }

    const prompt = `
Please analyze the following article and provide:
1. A concise summary (3-4 sentences) focused on the key facts and main points
2. The most important implications or impacts of this news
3. Why this matters to readers, especially considering trends in ${article.category}

Title: ${article.title}
Content: ${article.content || article.summary}

Format your response in a conversational tone, without using bullet points or numbered lists.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo-0125',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 250
      },
      {
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    }
    
    return "Unable to generate AI summary at this time.";
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return "Error generating AI summary. Please try again later.";
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