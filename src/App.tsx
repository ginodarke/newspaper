import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/" element={
                <MainLayout>
                  <Home />
                </MainLayout>
              } />
              <Route path="/feed" element={
                <MainLayout>
                  <ErrorBoundary>
                    <NewsFeed />
                  </ErrorBoundary>
                </MainLayout>
              } />
              <Route path="/search" element={
                <MainLayout>
                  <ErrorBoundary>
                    <SearchResults />
                  </ErrorBoundary>
                </MainLayout>
              } />
              <Route path="/profile" element={
                <MainLayout>
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                </MainLayout>
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

export default App; 