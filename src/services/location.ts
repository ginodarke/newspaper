import axios from 'axios';

// Interface for location details
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  formattedAddress?: string;
}

// Get current location using navigator.geolocation
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve(locationData);
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Get address details from coordinates using OpenStreetMap Nominatim API
export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<LocationData> => {
  try {
    // Using OpenStreetMap's Nominatim service for reverse geocoding
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NewspaperAI/1.0'
        }
      }
    );

    const data = response.data;
    
    return {
      latitude,
      longitude,
      address: data.display_name,
      city: data.address.city || data.address.town || data.address.village || data.address.hamlet,
      region: data.address.state || data.address.county,
      country: data.address.country,
      formattedAddress: data.display_name
    };
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    // Return basic location data if reverse geocoding fails
    return { latitude, longitude };
  }
};

// Get complete location information
export const getCompleteLocationData = async (): Promise<LocationData> => {
  try {
    const basicLocation = await getCurrentLocation();
    return await getAddressFromCoordinates(basicLocation.latitude, basicLocation.longitude);
  } catch (error) {
    console.error('Error getting complete location data:', error);
    throw error;
  }
};

// Parse location string from database into LocationData object
export const parseLocationString = (locationString: string): LocationData | null => {
  try {
    if (!locationString) return null;
    
    // Check if it's a lat,lng string
    if (locationString.includes(',')) {
      const [latStr, lngStr] = locationString.split(',');
      const latitude = parseFloat(latStr.trim());
      const longitude = parseFloat(lngStr.trim());
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { latitude, longitude };
      }
    }
    
    // Return null if we couldn't parse it
    return null;
  } catch (error) {
    console.error('Error parsing location string:', error);
    return null;
  }
};

// Format location for display
export const formatLocationForDisplay = (location: LocationData): string => {
  if (location.city && location.region) {
    return `${location.city}, ${location.region}`;
  } else if (location.city) {
    return location.city;
  } else if (location.formattedAddress) {
    return location.formattedAddress;
  } else {
    return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
  }
}; 