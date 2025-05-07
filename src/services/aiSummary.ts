import { Article } from '../types';

// In a real app, this would connect to OpenRouter/OpenAI API
// For this demo, we'll simulate AI responses

interface AISummaryResponse {
  aiSummary: string;
}

// Mock function for AI-powered article summary generation
// In a real app, this would call an AI service like OpenAI or Claude
export const generateArticleSummary = async (article: Article): Promise<AISummaryResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    aiSummary: 'This article discusses recent technological advancements and their potential impact on society and the economy.',
  };
};

// Mock function to enrich an article with AI insights
export const enrichArticleWithAI = async (article: Article, userPreferences: any): Promise<Article> => {
  // In a real implementation, we would call an AI API with the article content and user preferences
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Add AI-generated relevance reason based on user preferences
  return {
    ...article,
    relevanceReason: generateRelevanceReason(userPreferences.categories)
  };
};

// Mock function to generate personal relevance explanation
export const generatePersonalRelevance = async (): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const reasons = [
    'This aligns with your interest in technology and recent browsing patterns.',
    'Based on your selected topics, this news may impact your professional field.',
    'You\'ve shown interest in similar topics over the past week.',
    'This relates to your location and local developments you might want to follow.',
    'This topic intersects with multiple interests in your profile.'
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Helper function to generate relevance reasons based on user categories
function generateRelevanceReason(categories: string[]): string {
  if (!categories || categories.length === 0) {
    return 'This is a trending topic you might find interesting.';
  }
  
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const templates = [
    `Based on your interest in ${randomCategory}.`,
    `This relates to ${randomCategory}, which appears in your preferences.`,
    `You've expressed interest in ${randomCategory}, which this article covers.`,
    `This might be relevant to your interest in ${randomCategory}.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
} 