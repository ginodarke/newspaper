import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getArticles } from '../services/news';
import { getCurrentLocation, getAddressFromCoordinates, LocationData } from '../services/location';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types';
import { ChevronLeft, ChevronRight, MapPin, Loader2 } from 'lucide-react';

export default function LocalNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const { user } = useAuth();
  
  const ARTICLES_PER_PAGE = 12;

  useEffect(() => {
    // Get user location and load local news
    const getLocationAndNews = async () => {
      setLocationLoading(true);
      try {
        // Try to get user's current location
        const coords = await getCurrentLocation();
        if (coords) {
          const locationData = await getAddressFromCoordinates(coords.latitude, coords.longitude);
          setLocation(locationData);
          await loadLocalArticles(locationData);
        } else {
          setError('Unable to get your location. Please allow location access for local news.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Failed to determine your location. Please ensure location services are enabled.');
        setLoading(false);
      } finally {
        setLocationLoading(false);
      }
    };
    
    getLocationAndNews();
  }, []);

  const loadLocalArticles = async (locationData: LocationData) => {
    try {
      setLoading(true);
      // Get local news using the new getArticles function with options
      const response = await getArticles({
        category: 'Local',
        location: locationData,
        page: 1,
        pageSize: ARTICLES_PER_PAGE
      });
      
      setArticles(response.articles);
      setTotalPages(Math.ceil(response.totalResults / ARTICLES_PER_PAGE));
    } catch (err) {
      console.error('Error loading local articles:', err);
      setError('Failed to load local news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (articleId: string) => {
    // Implement save functionality
    console.log('Save article:', articleId);
  };

  const handleShare = async (articleId: string) => {
    // Implement share functionality
    console.log('Share article:', articleId);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Get current articles for the page
  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (location) loadLocalArticles(location);
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Local News</h1>
          {location && (
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {location.city ? location.city : ''} 
                {location.region ? (location.city ? `, ${location.region}` : location.region) : ''}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading State */}
      {(loading || locationLoading) && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {locationLoading ? 'Determining your location...' : 'Loading local news...'}
          </p>
        </div>
      )}
      
      {/* Articles Grid */}
      {!loading && !locationLoading && currentArticles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard
                    article={article}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
      
      {/* Empty State */}
      {!loading && !locationLoading && currentArticles.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">No Local News Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any local news for your current location. This could be because of limited coverage in your area.
            </p>
            <button
              onClick={() => {
                if (location) loadLocalArticles(location);
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 