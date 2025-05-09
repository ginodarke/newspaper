import { useEffect, useState } from 'react';

interface FeatureFlags {
  // Environment variables
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  hasOpenRouterKey: boolean;
  hasNewsApiKey: boolean;
  hasTheNewsApiKey: boolean;
  hasNewsDataKey: boolean;
  hasApiTubeKey: boolean;
  hasRadarKey: boolean;
  hasGoogleApiKey: boolean;
  
  // Feature flags
  enableDebugMode: boolean;
  enableErrorDiagnostics: boolean;
  enableMockData: boolean;
  
  // Runtime environment
  isDevelopment: boolean;
  isProduction: boolean;
  browserInfo: {
    userAgent: string;
    language: string;
    online: boolean;
    cookiesEnabled: boolean;
    platform: string;
  }
}

/**
 * A hook that provides feature flags and environment checks
 */
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>({
    // Environment variables
    hasSupabaseUrl: false,
    hasSupabaseAnonKey: false,
    hasOpenRouterKey: false,
    hasNewsApiKey: false,
    hasTheNewsApiKey: false,
    hasNewsDataKey: false,
    hasApiTubeKey: false,
    hasRadarKey: false,
    hasGoogleApiKey: false,
    
    // Feature flags
    enableDebugMode: false,
    enableErrorDiagnostics: false,
    enableMockData: false,
    
    // Runtime environment
    isDevelopment: false,
    isProduction: false,
    browserInfo: {
      userAgent: '',
      language: '',
      online: false,
      cookiesEnabled: false,
      platform: '',
    }
  });
  
  useEffect(() => {
    // Check environment variables
    const envFlags = {
      hasSupabaseUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
      hasSupabaseAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
      hasOpenRouterKey: Boolean(import.meta.env.VITE_OPENROUTER_API_KEY),
      hasNewsApiKey: Boolean(import.meta.env.VITE_NEWSAPI_KEY),
      hasTheNewsApiKey: Boolean(import.meta.env.VITE_THENEWSAPI_KEY),
      hasNewsDataKey: Boolean(import.meta.env.VITE_NEWSDATA_KEY),
      hasApiTubeKey: Boolean(import.meta.env.VITE_APITUBE_KEY),
      hasRadarKey: Boolean(import.meta.env.VITE_RADAR_PUBLISHABLE_KEY),
      hasGoogleApiKey: Boolean(import.meta.env.VITE_GOOGLE_API_KEY),
      
      // Runtime environment
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    };
    
    // Check URL parameters for debug mode
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    
    // Browser info
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
    };
    
    // Update all flags
    setFlags({
      ...envFlags,
      enableDebugMode: debugMode || envFlags.isDevelopment,
      enableErrorDiagnostics: debugMode || envFlags.isDevelopment,
      enableMockData: (urlParams.get('mock') === 'true') || false,
      browserInfo,
    });
    
    // Log debug information in development
    if (envFlags.isDevelopment || debugMode) {
      console.log('Feature Flags:', {
        ...envFlags,
        enableDebugMode: debugMode || envFlags.isDevelopment,
        browserInfo,
      });
    }
  }, []);
  
  return flags;
}

export default useFeatureFlags; 