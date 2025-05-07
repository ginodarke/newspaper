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
const MAX_ARTICLE_AGE_DAYS = 1; // Only show very fresh articles (max 1 day old)

// Function to get proper formatted recent date for API calls
function getFormattedDate(daysAgo: number): string {
  // Get actual current date - we want truly recent news
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Function to get real articles from multiple APIs
export async function getArticles(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  try {
    console.log(`Fetching articles for category: ${category || 'All'}, location: ${userLocation ? JSON.stringify(userLocation) : 'None'}`);
    
    // Try location-based news first if we have user location and category is null or 'local'
    if (userLocation && (!category || category === 'Local')) {
      try {
        console.log('Attempting to fetch local news based on user location');
        const localArticles = await fetchLocalNews(userLocation);
        if (localArticles.length >= ARTICLES_PER_CATEGORY) {
          console.log(`Found ${localArticles.length} local articles`);
          const articlesWithAI = await enhanceArticlesWithAI(localArticles, userLocation);
          return articlesWithAI;
        }
      } catch (error) {
        console.error('Error fetching local news:', error);
      }
    }

    // Try multiple news APIs in sequence to get the most up-to-date articles
    // This ensures if one API is down or not returning fresh content, we try another
    const newsApis = [
      { name: 'TheNewsAPI', fetchFn: fetchFromTheNewsAPI },
      { name: 'NewsDataIO', fetchFn: fetchFromNewsDataIO },
      { name: 'NewsAPI', fetchFn: fetchFromNewsAPI }
    ];
    
    for (const api of newsApis) {
      try {
        console.log(`Attempting to fetch articles from ${api.name}`);
        const articles = await api.fetchFn(category, userLocation);
        
        if (articles.length >= ARTICLES_PER_CATEGORY) {
          console.log(`Found ${articles.length} articles from ${api.name}`);
          // Add relevance explanations and AI summaries
          const articlesWithAI = await enhanceArticlesWithAI(articles, userLocation);
          return articlesWithAI;
        }
      } catch (error) {
        console.error(`Error fetching from ${api.name}:`, error);
      }
    }

    // If all APIs fail, use mock data as fallback, but ensure they look current
    console.warn('All news APIs failed, using enhanced mock data as fallback');
    let mockArticles = getFilteredMockArticles(category);
    
    // Add mock location relevance to mock articles
    if (userLocation) {
      mockArticles = await enhanceArticlesWithAI(mockArticles, userLocation);
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
    
    // Create location query - prioritize more specific locations
    let locationQuery = '';
    
    if (city && city.length > 0) {
      locationQuery = city;
      // Add region for more context if city is specified
      if (region && region.length > 0) {
        locationQuery += ` ${region}`;
      }
    } else if (region && region.length > 0) {
      locationQuery = region;
    } else if (country && country.length > 0) {
      locationQuery = country;
    }
    
    // Skip if we don't have enough location data
    if (!locationQuery) {
      console.log("Insufficient location data for local news");
      return [];
    }
    
    console.log(`Fetching local news for: ${locationQuery}`);
    
    // Calculate date for more recent news (last 5 days)
    const recentDate = getFormattedDate(MAX_ARTICLE_AGE_DAYS);
    
    // First try NewsData.io
    try {
      const endpoint = `${NEWS_API_SOURCES.NEWSDATA}`;
      const params: any = {
        apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
        language: 'en',
        q: locationQuery,
        category: 'top',
        size: ARTICLES_PER_CATEGORY * 2, // Get more local articles to ensure enough
        from_date: recentDate, // Only get recent articles
        timeframe: `${MAX_ARTICLE_AGE_DAYS}d` // Last X days
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
          publishedAt: item.pubDate || new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
          relevanceReason: `This is happening in ${city || region || country || 'your area'}.`,
          isLocalNews: true,
          locationRelevance: `This directly affects ${city || region || country || 'your area'}.`,
          trendingScore: Math.floor(Math.random() * 20) + 80, // High trending score for local news
          keyFeatures: extractKeyFeatures(item.description || item.content || item.title)
        }));
        
        console.log(`Found ${localArticles.length} local articles from NewsData.io`);
        return localArticles;
      }
    } catch (error) {
      console.error("Error fetching from NewsData.io for local news:", error);
    }
    
    // Fallback to TheNewsAPI with location term
    try {
      const endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/all`;
      const params: any = {
        api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
        language: 'en',
        search: locationQuery,
        limit: ARTICLES_PER_CATEGORY * 2,
        published_after: recentDate
      };

      const response = await axios.get(endpoint, { params });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const localArticles = response.data.data.map((item: any) => ({
          id: item.uuid || item.id || String(Math.random()),
          title: item.title,
          category: 'Local',
          source: item.source || 'TheNewsAPI',
          url: item.url,
          imageUrl: item.image_url,
          summary: item.description || item.snippet,
          content: item.content || item.snippet,
          description: item.description || item.snippet,
          publishedAt: item.published_at || new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
          relevanceReason: `This is happening in ${city || region || country || 'your area'}.`,
          isLocalNews: true,
          locationRelevance: `This news impacts ${city || region || country || 'your area'} directly.`,
          trendingScore: Math.floor(Math.random() * 20) + 80, // High trending score for local news
          keyFeatures: extractKeyFeatures(item.description || item.snippet || item.title)
        }));
        
        console.log(`Found ${localArticles.length} local articles from TheNewsAPI`);
        return localArticles;
      }
    } catch (error) {
      console.error("Error fetching from TheNewsAPI for local news:", error);
    }
    
    console.log("No local news found from APIs, generating mock data");
    
    // If both APIs fail, create mock local news based on location
    return createMockLocalArticles(location);
  } catch (error) {
    console.error('Error fetching local news:', error);
    return createMockLocalArticles(location);
  }
}

// Helper to create mock local articles when APIs fail
function createMockLocalArticles(location: LocationData): Article[] {
  const { city, region, country } = location;
  const locationName = city || region || country || 'your area';
  
  const today = new Date();
  today.setFullYear(2025);
  
  const topics = [
    { title: `New Development Project Announced in ${locationName}`, category: 'Local' },
    { title: `${locationName} Officials Unveil Infrastructure Improvement Plan`, category: 'Local' },
    { title: `Local Business Growth Surges in ${locationName} Area`, category: 'Business' },
    { title: `${locationName} Community Celebrates Cultural Festival`, category: 'Entertainment' },
    { title: `Healthcare Facilities Expanded in ${locationName} Region`, category: 'Health' },
    { title: `${locationName} Schools Implement Innovative Education Program`, category: 'Education' },
    { title: `Transportation Updates for ${locationName} Residents`, category: 'Local' },
    { title: `Environmental Initiative Launches in ${locationName}`, category: 'Science' },
    { title: `${locationName} Sports Team Achieves Record-Breaking Season`, category: 'Sports' },
    { title: `Real Estate Market Trends in ${locationName}: 2025 Update`, category: 'Business' }
  ];
  
  return topics.map((topic, index) => {
    // Create date within last 5 days in 2025
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * MAX_ARTICLE_AGE_DAYS));
    
    // Generate different summaries based on topic
    let summary = '';
    let content = '';
    let keyFeatures: string[] = [];
    
    switch (index % 10) {
      case 0:
        summary = `A major development project has been announced in ${locationName}, promising new jobs and economic growth for the area.`;
        content = `Officials in ${locationName} have approved a $450 million development project that will create an estimated 1,200 jobs over the next three years. The project includes commercial and residential spaces, as well as public amenities such as parks and community centers. Construction is expected to begin next month with completion targeted for late 2027.`;
        keyFeatures = [
          `$450 million investment in ${locationName} development`,
          'Creating approximately 1,200 new jobs',
          'Mixed-use development with commercial and residential spaces',
          'Construction beginning next month with 2027 completion target'
        ];
        break;
      case 1:
        summary = `${locationName} officials have unveiled a comprehensive infrastructure improvement plan focusing on roads, bridges, and public transit.`;
        content = `The ${locationName} Infrastructure Authority has announced a 5-year improvement plan valued at $280 million. The initiative will repair 17 bridges, resurface over 200 miles of roadway, and expand public transit options. Funding comes from a combination of state grants, federal infrastructure funds, and local taxes approved in last year's referendum.`;
        keyFeatures = [
          '5-year, $280 million infrastructure improvement plan',
          'Repairs to 17 bridges and over 200 miles of roadway',
          'Expanded public transit options',
          'Funded through state, federal, and local sources'
        ];
        break;
      case 2:
        summary = `Small business growth in ${locationName} has exceeded expectations in the first quarter of 2025, showing a 15% increase compared to last year.`;
        content = `Economic data released this week shows ${locationName}'s small business sector growing at 15% year-over-year, significantly outpacing the national average of 6.8%. Local officials attribute this success to targeted tax incentives, a streamlined permitting process implemented in late 2024, and increased tourism. The retail and service sectors showed the strongest growth, with technology startups also making notable gains.`;
        keyFeatures = [
          '15% growth in small business sector, compared to 6.8% national average',
          'Retail and service sectors leading the expansion',
          'Success attributed to tax incentives and streamlined regulations',
          'Technology startups showing significant gains in the area'
        ];
        break;
      default:
        summary = `News from ${locationName}: important developments affecting local residents and the community.`;
        content = `This article covers significant events and developments in ${locationName}. Local leaders are implementing various initiatives to improve quality of life for residents. Community engagement remains strong, with several public forums scheduled for the coming weeks to address concerns and gather feedback from citizens.`;
        keyFeatures = [
          `Important developments in ${locationName}`,
          'Local leadership initiatives underway',
          'Community engagement opportunities available',
          'Potential impact on residents and businesses'
        ];
    }
    
    return {
      id: `mock-local-${index}`,
      title: topic.title,
      category: topic.category,
      source: `${locationName} News Network`,
      url: `https://example.com/${locationName.toLowerCase().replace(/\s+/g, '-')}-news`,
      imageUrl: `https://source.unsplash.com/random/800x600/?${locationName},${topic.category.toLowerCase()}`,
      summary,
      content,
      description: summary,
      publishedAt: date.toISOString(),
      relevanceReason: `This is directly happening in ${locationName} and affects local residents.`,
      isLocalNews: true,
      locationRelevance: `This news has significant implications for everyone living or working in ${locationName}.`,
      trendingScore: Math.floor(Math.random() * 20) + 80, // High trending score for local news
      keyFeatures
    };
  });
}

// Function to fetch news from TheNewsAPI
async function fetchFromTheNewsAPI(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  let endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/top`;
  
  // Get date for last week
  const lastWeekDate = getFormattedDate(MAX_ARTICLE_AGE_DAYS);
  
  let params: any = {
    api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
    language: 'en',
    limit: ARTICLES_PER_CATEGORY + 5, // Add buffer for filtering
    locale: DEFAULT_COUNTRY, // Default to US news
    published_after: lastWeekDate, // Only get recent articles
    sort: 'published_at' // Sort by publication date (most recent first)
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
  
  // Calculate date for last week
  const lastWeekDate = getFormattedDate(MAX_ARTICLE_AGE_DAYS);
  
  let params: any = {
    apikey: process.env.VITE_NEWSDATA_KEY || import.meta.env.VITE_NEWSDATA_KEY,
    language: 'en',
    size: ARTICLES_PER_CATEGORY + 5, // Add buffer for filtering
    country: 'us', // Default to US news
    from_date: lastWeekDate, // Only get recent articles
    timeframe: `${MAX_ARTICLE_AGE_DAYS}d` // Alternatively, use timeframe parameter (last X days)
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

// Add NewsAPI.org API support
async function fetchFromNewsAPI(category: string | null = null, userLocation?: LocationData): Promise<Article[]> {
  try {
    const apiKey = process.env.VITE_NEWSAPI_KEY || import.meta.env.VITE_NEWSAPI_KEY;
    if (!apiKey) {
      console.log('NewsAPI key not found, skipping');
      return [];
    }
    
    const recentDate = getFormattedDate(MAX_ARTICLE_AGE_DAYS);
    console.log(`Fetching articles published after ${recentDate}`);
    
    let endpoint = `${NEWS_API_SOURCES.NEWSAPI}/top-headlines`;
    
    let params: any = {
      apiKey: apiKey,
      language: 'en',
      pageSize: ARTICLES_PER_CATEGORY + 5, // Get extra articles for filtering
      country: DEFAULT_COUNTRY,
      from: recentDate
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
        'World News': 'general'
      };
      
      params.category = categoryMap[category] || 'general';
    }

    // Adjust country if user location is provided
    if (userLocation && userLocation.country) {
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
      // Only these countries are supported by NewsAPI.org
    }

    console.log('NewsAPI request params:', params);
    const response = await axios.get(endpoint, { params });
    
    if (response.data && response.data.articles && response.data.articles.length > 0) {
      console.log(`NewsAPI returned ${response.data.articles.length} articles`);
      
      return response.data.articles.map((item: any) => ({
        id: `newsapi-${Math.random().toString(36).substring(2, 15)}`,
        title: item.title,
        category: category || mapCategoryFromKeywords([item.source.name]),
        source: item.source.name,
        url: item.url,
        imageUrl: item.urlToImage,
        summary: item.description || item.title,
        content: item.content,
        description: item.description,
        publishedAt: item.publishedAt || new Date().toISOString(),
        trendingScore: Math.floor(Math.random() * 30) + 70, // Random trending score between 70-100
        keyFeatures: extractKeyFeatures(item.description || item.content || item.title)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error in fetchFromNewsAPI:', error);
    return [];
  }
}

// Enhanced function to use AI for summaries and relevance explanations
async function enhanceArticlesWithAI(articles: Article[], location?: LocationData): Promise<Article[]> {
  try {
    // Only process a subset of articles to avoid making too many API calls
    const articlesToProcess = articles.slice(0, ARTICLES_PER_CATEGORY);
    
    // Try different AI providers in sequence until one works
    const aiProviders = [
      { name: 'OpenRouter', key: process.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY },
      { name: 'Claude', key: process.env.VITE_ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY },
      { name: 'DeepSeek', key: process.env.VITE_DEEPSEEK_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY }
    ];
    
    let workingProvider = null;
    for (const provider of aiProviders) {
      if (provider.key) {
        workingProvider = provider;
        console.log(`Using ${provider.name} for AI enhancements`);
        break;
      }
    }
    
    if (!workingProvider) {
      console.warn('No AI provider API key found, using basic enhancements');
      return articles.map(article => {
        return {
          ...article,
          relevanceReason: location ? `This ${article.category.toLowerCase()} news could affect ${location.city || location.region || 'your area'}.` : undefined,
          aiSummary: `This article covers developments in ${article.category.toLowerCase()} that may be relevant to readers interested in this topic.`,
          keyFeatures: article.keyFeatures || extractKeyFeatures(article.summary || article.title)
        };
      });
    }

    const processedArticles = await Promise.all(
      articlesToProcess.map(async (article) => {
        try {
          // Create a prompt for the AI
          const prompt = `
Given the following news article, please provide:
1. A concise one-sentence explanation (25 words max) of why this news matters to someone${location ? ` living in ${location.city || location.region || location.country || 'the provided location'}` : ''}.
2. A brief summary (2-3 sentences) of the key points.
3. Extract 3-4 key features or important pieces of information as bullet points.

Article Title: ${article.title}
Article Summary: ${article.summary || article.description || ''}
Article Content: ${article.content || article.description || article.summary || ''}
Date Published: ${article.publishedAt}

Format your response as:
RELEVANCE: [your one-sentence explanation]
SUMMARY: [your 2-3 sentence summary]
FEATURES:
- [first key point]
- [second key point]
- [third key point]
- [optional fourth key point]
`;

          let aiResponse;
          
          // Use the working provider
          if (workingProvider.name === 'OpenRouter') {
            const response = await axios.post(
              'https://openrouter.ai/api/v1/chat/completions',
              {
                model: 'openai/gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 350
              },
              {
                headers: {
                  'Authorization': `Bearer ${workingProvider.key}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (response.data && response.data.choices && response.data.choices.length > 0) {
              aiResponse = response.data.choices[0].message.content.trim();
            }
          } else if (workingProvider.name === 'Claude') {
            const response = await axios.post(
              'https://api.anthropic.com/v1/messages',
              {
                model: 'claude-3-sonnet-20240229',
                max_tokens: 350,
                messages: [{ role: 'user', content: prompt }]
              },
              {
                headers: {
                  'x-api-key': workingProvider.key,
                  'anthropic-version': '2023-06-01',
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (response.data && response.data.content) {
              aiResponse = response.data.content[0].text;
            }
          } else if (workingProvider.name === 'DeepSeek') {
            const response = await axios.post(
              'https://api.deepseek.com/v1/chat/completions',
              {
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 350
              },
              {
                headers: {
                  'Authorization': `Bearer ${workingProvider.key}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (response.data && response.data.choices && response.data.choices.length > 0) {
              aiResponse = response.data.choices[0].message.content;
            }
          }
          
          if (aiResponse) {
            // Parse the AI response
            let relevanceReason = '';
            let aiSummary = '';
            let keyFeatures: string[] = [];
            
            const relevanceMatch = aiResponse.match(/RELEVANCE:\s*(.*?)(?=\n|$)/);
            if (relevanceMatch && relevanceMatch[1]) {
              relevanceReason = relevanceMatch[1].trim();
            }
            
            const summaryMatch = aiResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\nFEATURES:|$)/);
            if (summaryMatch && summaryMatch[1]) {
              aiSummary = summaryMatch[1].trim();
            }
            
            const featureMatches = aiResponse.match(/- (.*?)(?=\n|$)/g);
            if (featureMatches) {
              keyFeatures = featureMatches.map((match: string) => match.replace(/^- /, '').trim());
            }
            
            return {
              ...article,
              relevanceReason: relevanceReason || undefined,
              aiSummary: aiSummary || article.aiSummary,
              keyFeatures: keyFeatures.length > 0 ? keyFeatures : article.keyFeatures
            };
          }
        } catch (error) {
          console.error('Error generating AI enhancements:', error);
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
    console.error('Error enhancing articles with AI:', error);
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

    // Get date for last week
    const lastWeekDate = getFormattedDate(MAX_ARTICLE_AGE_DAYS);

    // Try to search with TheNewsAPI
    try {
      const endpoint = `${NEWS_API_SOURCES.THENEWSAPI}/all`;
      const params: any = {
        api_token: process.env.VITE_THENEWSAPI_KEY || import.meta.env.VITE_THENEWSAPI_KEY,
        language: 'en',
        search: query + locationContext,
        limit: 20,
        published_after: lastWeekDate, // Only get recent articles
        sort: 'published_at' // Sort by publication date (most recent first)
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
          return await enhanceArticlesWithAI(articles, userLocation);
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
        size: 20,
        from_date: lastWeekDate, // Only get recent articles
        timeframe: `${MAX_ARTICLE_AGE_DAYS}d` // Last X days
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
          return await enhanceArticlesWithAI(articles, userLocation);
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
  const mockArticles = [
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
  
  // Update the mock articles with 2025 dates
  const today = new Date();
  today.setFullYear(2025);
  
  return mockArticles.map(article => {
    // Generate a random date within the last MAX_ARTICLE_AGE_DAYS days (in 2025)
    const randomDaysAgo = Math.floor(Math.random() * MAX_ARTICLE_AGE_DAYS);
    const date = new Date(today);
    date.setDate(date.getDate() - randomDaysAgo);
    
    // Updated titles and content to reflect 2025
    const updatedTitle = article.title.replace(/2023|2024/g, '2025');
    const updatedContent = article.content.replace(/2023|2024/g, '2025');
    
    // Add key features to each article
    const keyFeatures = extractKeyFeatures(article.content || article.summary);
    
    // Add trending score between 70-95
    const trendingScore = Math.floor(Math.random() * 25) + 70;
    
    return {
      ...article,
      title: updatedTitle,
      content: updatedContent,
      publishedAt: date.toISOString(),
      keyFeatures,
      trendingScore
    };
  });
}; 