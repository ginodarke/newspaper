import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import useFeatureFlags from './hooks/useFeatureFlags';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Common components
import LoadingSpinner from './components/LoadingSpinner';

// Debug components
const EnvironmentChecker = lazy(() => import('./components/debug/EnvironmentChecker'));

// Page components (lazy-loaded)
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const LocalNews = lazy(() => import('./pages/LocalNews'));
const Profile = lazy(() => import('./pages/Profile'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple error display for production
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="p-6 mx-auto my-8 max-w-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-bold mb-4">Application Error</h2>
      <p className="mb-4">We're sorry, but something went wrong. Please try again.</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Page
      </button>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Debug component that shows up when debug parameter is true
function DebugOverlay() {
  const { enableDebugMode } = useFeatureFlags();
  const [isVisible, setIsVisible] = useState(true);
  
  if (!enableDebugMode) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto" style={{ display: isVisible ? 'block' : 'none' }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="p-1">
            <Suspense fallback={<LoadingFallback />}>
              <EnvironmentChecker />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main layout component that uses context
function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { enableDebugMode } = useFeatureFlags();
  
  // Check for debug mode from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const isDebug = urlParams.get('debug') === 'true';
    
    if (isDebug) {
      console.log('Debug mode enabled via URL');
    }
  }, [location.search]);

  // Show loading state while auth is being determined
  if (loading) {
    return <LoadingFallback />;
  }

  // Determine which layout elements to show
  const showSidebar = user && !['/auth', '/onboarding', '/'].includes(location.pathname);
  const showHeader = !['/auth', '/onboarding'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header onMenuClick={() => console.log("Menu clicked")} />}
      
      <div className={`flex flex-1 ${showSidebar ? 'md:grid md:grid-cols-[280px_1fr]' : ''}`}>
        {showSidebar && (
          <div className="hidden md:block w-[280px] border-r border-border">
            <Sidebar />
          </div>
        )}
        
        <main className="flex-1 p-4">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/categories/:category" element={<NewsFeed />} />
              <Route path="/local" element={<LocalNews />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/article/:id" element={<NewsFeed />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      
      {/* Debug overlay that appears when debug=true is in the URL */}
      {enableDebugMode && <DebugOverlay />}
    </div>
  );
}

// Main App component with proper provider ordering
export default function App() {
  // Global error handler
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Log to console normally
      originalConsoleError(...args);
      
      // Check if this is a React error
      const errorString = args.join(' ');
      if (errorString.includes('React') || errorString.includes('Warning:')) {
        console.log('React error detected:', errorString);
      }
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  try {
    return (
      <ErrorBoundary fallbackRender={({ error }) => <ErrorDisplay error={error} />}>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Fatal error in App:', error);
    return <ErrorDisplay error={error instanceof Error ? error : new Error('Unknown error')} />;
  }
} 