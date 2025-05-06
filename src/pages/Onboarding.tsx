import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { saveUserPreferences } from '../services/news';
import { createProfile } from '../services/supabase';
import { getCurrentLocation, getAddressFromCoordinates, LocationData, formatLocationForDisplay } from '../services/location';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NewsGlobe } from '../components/3DElements';

// Component to properly wrap the NewsGlobe in Canvas
function GlobeWrapper({ size = "medium" }: { size?: "small" | "medium" | "large" | number }) {
  return (
    <div className={`relative ${size === "small" ? "h-24 w-24" : size === "medium" ? "h-40 w-40" : "h-52 w-52"} mx-auto`}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <NewsGlobe size={size} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUserAfterSignUp } = useAuth();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      // If we already have a user in context but were directed to onboarding,
      // we should allow the onboarding to proceed
      if (user) {
        console.log("User authenticated in onboarding:", user);
      }
    };
    
    checkUserSession();
  }, [user, navigate]);
  
  const availableInterests = [
    "Technology", "Business", "Politics", "Science", 
    "Health", "Sports", "Entertainment", "World News"
  ];
  
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const requestLocation = async () => {
    setLocationLoading(true);
    setError('');
    
    try {
      // Get current location coordinates
      const location = await getCurrentLocation();
      setLocationData(location);
      setLocation('Location detected');
      
      // Try to get address details
      try {
        const addressData = await getAddressFromCoordinates(location.latitude, location.longitude);
        setLocationData(addressData);
        setLocation(formatLocationForDisplay(addressData));
      } catch (addressError) {
        console.error('Error getting address:', addressError);
        // If we can't get the address, just use the coordinates
        setLocation(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      setError(error.message || 'Failed to get your location');
      setLocation('Location permission denied');
    } finally {
      setLocationLoading(false);
    }
  };
  
  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - save preferences to Supabase
      setLoading(true);
      setError('');
      
      try {
        // If somehow we don't have a user, create a temporary one for demo purposes
        const userId = user ? user.id : 'temp-' + new Date().getTime();
        
        // For real user, save the preferences
        if (user) {
          // Prepare location string for storage
          const locationString = locationData 
            ? `${locationData.latitude},${locationData.longitude}` 
            : location;
          
          // Create user profile if it doesn't exist
          await createProfile(user.id, {
            display_name: user.email?.split('@')[0] || 'User',
            email: user.email,
            interests: interests,
            location: locationString
          });
          
          // Save user preferences
          const { success, error } = await saveUserPreferences(user.id, {
            categories: interests,
            sources: [],
            location: locationString
          });
          
          if (!success) throw error;
        } else {
          // For demo mode (no user), set a temporary user
          // This is just for demo/development and would not be in production
          setUserAfterSignUp({
            id: userId,
            email: 'demo@example.com'
          });
          
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Navigate to news feed
        navigate('/feed');
      } catch (err: any) {
        setError(err.message || 'Failed to save preferences');
        console.error('Error saving preferences:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 } 
    }
  };

  // Item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="text-center">
          <motion.h1 
            className="text-3xl font-bold text-blue-600 dark:text-blue-400"
            variants={itemVariants}
          >
            Set Up Your Profile
          </motion.h1>
          <motion.p 
            className="mt-2 text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            Step {step} of 3
          </motion.p>
          <motion.div 
            className="w-full bg-gray-200 dark:bg-gray-700 h-2 mt-4 rounded-full overflow-hidden"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              initial={{ width: `${((step - 1) / 3) * 100}%` }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
        
        {error && (
          <motion.div 
            className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}
        
        {step === 1 && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-xl font-semibold text-gray-800 dark:text-white"
              variants={itemVariants}
            >
              Choose Your Interests
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              variants={itemVariants}
            >
              Select topics you're interested in for personalized news.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              variants={itemVariants}
            >
              {availableInterests.map(interest => (
                <motion.button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-md border text-center transition-colors ${
                    interests.includes(interest)
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:border-blue-400'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {interest}
                </motion.button>
              ))}
            </motion.div>

            <motion.div 
              className="flex justify-center mt-6"
              variants={itemVariants}
            >
              <GlobeWrapper size="small" />
            </motion.div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-xl font-semibold text-gray-800 dark:text-white"
              variants={itemVariants}
            >
              Set Your Location
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              variants={itemVariants}
            >
              This helps us deliver local news relevant to you.
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.button
                onClick={requestLocation}
                className="w-full px-4 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={locationLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {locationLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use My Current Location
                  </>
                )}
              </motion.button>
              
              {location && (
                <motion.div 
                  className="p-3 bg-green-50 text-green-800 rounded-md dark:bg-green-900/30 dark:text-green-300 flex items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{location}</span>
                </motion.div>
              )}
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Or</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  placeholder="Enter your city or zip code"
                  value={location === "Location detected" || location === "Location permission denied" || location === "Geolocation not supported" ? "" : location}
                  onChange={(e) => {
                    setLocationData(null);
                    setLocation(e.target.value);
                  }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex justify-center mt-4"
              variants={itemVariants}
            >
              <GlobeWrapper size="medium" />
            </motion.div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-xl font-semibold text-gray-800 dark:text-white text-center"
              variants={itemVariants}
            >
              Ready to Go!
            </motion.h2>
            
            <motion.div 
              className="flex justify-center py-4"
              variants={itemVariants}
            >
              <GlobeWrapper size="large" />
            </motion.div>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-center"
              variants={itemVariants}
            >
              Your profile is set up and we're ready to show you personalized news that matters to you.
            </motion.p>
            
            <motion.div 
              className="p-6 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
              variants={itemVariants}
            >
              <h3 className="font-medium text-gray-800 dark:text-white">Your Preferences</h3>
              <p className="mt-2 dark:text-gray-300"><span className="font-medium">Interests:</span> {interests.join(', ') || 'None selected'}</p>
              <p className="mt-1 dark:text-gray-300"><span className="font-medium">Location:</span> {location || 'Not specified'}</p>
            </motion.div>
          </motion.div>
        )}
        
        <motion.div 
          className="flex justify-between mt-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleBack}
            className={`px-4 py-2 border border-gray-300 rounded-md transition-colors dark:border-gray-600 dark:text-gray-300 ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            disabled={step === 1}
            whileHover={step !== 1 ? { scale: 1.02 } : {}}
            whileTap={step !== 1 ? { scale: 0.98 } : {}}
          >
            Back
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {step === 3 ? 'Finish' : 'Next'}
                {step !== 3 && (
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
} 