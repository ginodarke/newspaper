import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveUserPreferences } from '../services/news';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use Radar API to get location details
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocationDetails(locationData);
          setLocation("Location detected");
        },
        () => {
          setLocation("Location permission denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
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
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const { success, error } = await saveUserPreferences(user.id, {
          categories: interests,
          sources: [],
          location: locationDetails ? 
            `${locationDetails.latitude},${locationDetails.longitude}` : 
            location
        });
        
        if (!success) throw error;
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
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Step {step} of 3
          </p>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Choose Your Interests</h2>
            <p className="text-gray-600">Select topics you're interested in for personalized news.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-md border text-center transition-colors ${
                    interests.includes(interest)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Set Your Location</h2>
            <p className="text-gray-600">This helps us deliver local news relevant to you.</p>
            
            <div className="space-y-4">
              <button
                onClick={requestLocation}
                className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-opacity-90"
              >
                Use My Current Location
              </button>
              
              {location && (
                <div className="p-3 bg-green-50 text-green-800 rounded-md">
                  {location}
                </div>
              )}
              
              <div className="text-center">
                <p className="text-sm text-gray-500">Or</p>
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Enter your city or zip code"
                  value={location === "Location detected" || location === "Location permission denied" || location === "Geolocation not supported" ? "" : location}
                  onChange={(e) => {
                    setLocationDetails(null);
                    setLocation(e.target.value);
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Ready to Go!</h2>
            <p className="text-gray-600">
              Your profile is set up and we're ready to show you personalized news that matters to you.
            </p>
            
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium">Your Preferences</h3>
              <p className="mt-2"><span className="font-medium">Interests:</span> {interests.join(', ') || 'None selected'}</p>
              <p className="mt-1"><span className="font-medium">Location:</span> {location || 'Not specified'}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-4 py-2 border border-gray-300 rounded-md ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-4 py-2 text-white bg-primary rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 