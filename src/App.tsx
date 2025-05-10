import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Loading from './components/Loading';

// Page components (lazy-loaded)
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const Profile = lazy(() => import('./pages/Profile'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

// New page components
const Trending = lazy(() => import('./pages/Trending'));
const Local = lazy(() => import('./pages/Local'));
const ForYou = lazy(() => import('./pages/ForYou'));
const National = lazy(() => import('./pages/National'));
const Saved = lazy(() => import('./pages/Saved'));

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

// Main App component
export default function App() {
  try {
    return (
      <ErrorBoundary fallbackRender={({ error }) => <ErrorDisplay error={error} />}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/news" element={<NewsFeed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/foryou" element={<ForYou />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/local" element={<Local />} />
                    <Route path="/national" element={<National />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/category/:category" element={<NewsFeed />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    return <ErrorDisplay error={error instanceof Error ? error : new Error('Unknown error')} />;
  }
} 