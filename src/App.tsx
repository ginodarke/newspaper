import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Common components
import LoadingSpinner from './components/LoadingSpinner';

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
    <div className="p-6 mx-auto my-8 max-w-2xl bg-red-50 border border-red-200 rounded-lg text-red-800">
      <h2 className="text-xl font-bold mb-4">Application Error</h2>
      <p className="mb-4">{error.message || "An unexpected error occurred"}</p>
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

// Main layout component that uses context
function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

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
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Fatal error in App:', error);
    return <ErrorDisplay error={error instanceof Error ? error : new Error('Unknown error')} />;
  }
} 