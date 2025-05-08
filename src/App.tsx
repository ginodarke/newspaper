import React, { Suspense, lazy } from 'react';
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
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
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

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const handleMenuClick = () => {
    console.log("Menu button clicked - placeholder function");
  };

  const showSidebar = user && !['/auth', '/onboarding'].includes(location.pathname);
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
              <Suspense fallback={<ActualPageLoader />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Navigate to="/feed" replace />} />

                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/feed" element={<NewsFeed />} />
                  <Route path="/article/:id" element={<NotFound />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/latest" element={<NewsFeed />} />
                  <Route path="/saved" element={<NotFound />} />
                  <Route path="/history" element={<NotFound />} />

                  {categories && categories.map(category => (
                    <Route 
                      key={category.path}
                      path={category.path} 
                      element={<NewsFeed />} 
                    />
                  ))}

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
    </div>
  );
}

export default App; 