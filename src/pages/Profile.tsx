import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserPreferences, saveUserPreferences } from '../services/news';
import ThemeToggle from '../components/ThemeToggle';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  
  const availableInterests = [
    "Technology", "Business", "Politics", "Science", 
    "Health", "Sports", "Entertainment", "World News"
  ];
  
  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { preferences, error } = await getUserPreferences(user.id);
        
        if (error) throw error;
        
        if (preferences) {
          setInterests(preferences.categories || []);
          setLocation(preferences.location || '');
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, navigate]);
  
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  
  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const { success, error } = await saveUserPreferences(user.id, {
        categories: interests,
        sources: [],
        location
      });
      
      if (!success) throw error;
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setSaveError('Failed to save your preferences. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-12 h-12 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              
              {user && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 rounded-md">
                  {error}
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select topics you're interested in to personalize your news feed.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-md border text-center transition-colors ${
                      interests.includes(interest)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update your location to get relevant local news.
              </p>
              
              <div className="mb-8">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or zip code"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              {saveError && (
                <div className="mt-4 mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 rounded-md">
                  {saveError}
                </div>
              )}
              
              {saveSuccess && (
                <div className="mt-4 mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md">
                  Your preferences have been saved successfully!
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/feed')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSavePreferences}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 