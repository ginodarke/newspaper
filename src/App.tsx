import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './contexts/AuthContext';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LocalNews = lazy(() => import('./pages/LocalNews'));

// Private route component to protect routes that require authentication
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              {/* Auth and Onboarding routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Redirect root to feed for authenticated users or onboarding for new users */}
              <Route path="/" element={
                <AuthRedirect />
              } />
              
              {/* Protected routes */}
              <Route path="/feed" element={
                <PrivateRoute>
                  <MainLayout>
                    <ErrorBoundary>
                      <NewsFeed />
                    </ErrorBoundary>
                  </MainLayout>
                </PrivateRoute>
              } />
              
              <Route path="/local" element={
                <PrivateRoute>
                  <MainLayout>
                    <ErrorBoundary>
                      <LocalNews />
                    </ErrorBoundary>
                  </MainLayout>
                </PrivateRoute>
              } />
              
              <Route path="/search" element={
                <PrivateRoute>
                  <MainLayout>
                    <ErrorBoundary>
                      <SearchResults />
                    </ErrorBoundary>
                  </MainLayout>
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <MainLayout>
                    <ErrorBoundary>
                      <Profile />
                    </ErrorBoundary>
                  </MainLayout>
                </PrivateRoute>
              } />
              
              <Route path="*" element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              } />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Component to handle root path redirects
function AuthRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If no user, redirect to the auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user exists, redirect to feed
  return <Navigate to="/feed" replace />;
}

export default App; 