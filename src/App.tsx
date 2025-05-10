import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Layout component with sidebar, header and main content area
function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-bg">
      <Header onMenuClick={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

// Component that handles auth-protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Routes component with proper layouts and protection
function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected routes wrapped in authentication check */}
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />
      
      {/* News routes with main layout - accessible to all users */}
      <Route 
        path="/feed" 
        element={
          <MainLayout>
            <NewsFeed />
          </MainLayout>
        } 
      />
      
      <Route 
        path="/local" 
        element={
          <MainLayout>
            <LocalNews />
          </MainLayout>
        } 
      />
      
      <Route 
        path="/search" 
        element={
          <MainLayout>
            <SearchResults />
          </MainLayout>
        } 
      />
      
      {/* Protected routes with main layout */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Content component that includes the routes and loading states
function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-primary-bg text-text-primary">
      <Suspense fallback={<LoadingSpinner size="large" />}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}

// Main App component with proper provider ordering
export default function App() {
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
    return <ErrorDisplay error={error instanceof Error ? error : new Error('Unknown error')} />;
  }
} 