import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { FallbackProps } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';

// Layout components
import Header from './components/layout/Header';
import Sidebar, { categories } from './components/layout/Sidebar';

// Common components
import ActualPageLoader from './components/LoadingSpinner';

// Page components (lazy-loaded)
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const LocalNews = lazy(() => import('./pages/LocalNews'));
const Profile = lazy(() => import('./pages/Profile'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Inline FallbackComponent for ErrorBoundary
const SimpleErrorFallback = ({ error }: FallbackProps) => (
  <div role="alert" className="p-4">
    <p className="text-red-500">Something went wrong:</p>
    <pre className="text-sm text-red-400">{error.message}</pre>
  </div>
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

// Error fallback for component-level errors
function ComponentErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <h2 className="mb-2 text-lg font-semibold">Component Error:</h2>
      <p className="mb-4">{error.message}</p>
      <details className="mb-4">
        <summary className="cursor-pointer font-medium">Technical Details</summary>
        <pre className="mt-2 max-h-40 overflow-auto rounded bg-white p-2 text-xs">{error.stack}</pre>
      </details>
      <button
        onClick={resetErrorBoundary}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Log app initialization
    console.log('App component mounted');
    
    // Log if any required API is missing
    const missingApis = [];
    if (typeof window.localStorage === 'undefined') missingApis.push('localStorage');
    if (typeof window.fetch === 'undefined') missingApis.push('fetch');
    if (typeof window.IntersectionObserver === 'undefined') missingApis.push('IntersectionObserver');
    
    if (missingApis.length > 0) {
      console.error('Missing browser APIs:', missingApis);
    }
    
    return () => {
      console.log('App component unmounted');
    };
  }, []);
  
  // Define the categories for the site
  const categories = [
    { name: 'Top Stories', key: '/' },
    { name: 'Local', key: '/local' },
    { name: 'Business', key: '/categories/business' },
    { name: 'Technology', key: '/categories/technology' },
    { name: 'Entertainment', key: '/categories/entertainment' },
    { name: 'Sports', key: '/categories/sports' },
    { name: 'Science', key: '/categories/science' },
    { name: 'Health', key: '/categories/health' },
  ];

  // Try-catch for any fatal errors during routing
  try {
    return (
      <ErrorBoundary 
        FallbackComponent={ComponentErrorFallback}
        onError={(error) => {
          console.error('App-level error caught:', error);
        }}
      >
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Router>
            <AuthProvider>
              <ThemeProvider>
                <AppContent />
              </ThemeProvider>
            </AuthProvider>
          </Router>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Fatal error in App component:', error);
    return (
      <div className="m-8 rounded-lg border border-red-300 bg-red-50 p-6 text-red-800">
        <h1 className="mb-4 text-2xl font-bold">Critical Application Error</h1>
        <p className="mb-4">
          The application encountered a fatal error and cannot continue. Please refresh the page.
        </p>
        <p className="font-medium">Error: {error instanceof Error ? error.message : String(error)}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    );
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const handleMenuClick = () => {
    console.log("Menu button clicked - placeholder function");
  };

  const showSidebar = user && !['/auth', '/onboarding', '/'].includes(location.pathname);
  const showHeader = !['/auth', '/onboarding'].includes(location.pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${showSidebar ? 'md:grid md:grid-cols-[280px_1fr]' : '' }`}>
        {showSidebar && (
          <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 w-[280px]">
            <Sidebar />
          </div>
        )}
        <div className={`flex flex-col flex-1 overflow-y-auto ${showSidebar ? 'md:pl-[280px]' : ''}`}>
          {showHeader && <Header onMenuClick={handleMenuClick} />}
          <main className="flex-1 overflow-x-hidden bg-background">
            <ErrorBoundary FallbackComponent={SimpleErrorFallback}>
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
            </ErrorBoundary>
          </main>
        </div>
    </div>
  );
}

export default App; 