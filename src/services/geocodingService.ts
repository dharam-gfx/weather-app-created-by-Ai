// Geocoding service for converting between addresses and coordinates
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export interface GeocodingResult {
  city: string;
  country: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured for geocoding');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;
    
    // Extract city and country from address components
    let city = '';
    let country = '';
    
    for (const component of result.address_components) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1') && !city) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    }

    return {
      city: city || 'Unknown City',
      country: country || 'Unknown Country',
      formatted_address: result.formatted_address,
      latitude: location.lat,
      longitude: location.lng
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodingResult | null> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured for reverse geocoding');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    
    // Extract city and country from address components
    let city = '';
    let country = '';
    
    for (const component of result.address_components) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1') && !city) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    }

    return {
      city: city || 'Unknown City',
      country: country || 'Unknown Country',
      formatted_address: result.formatted_address,
      latitude,
      longitude
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};
