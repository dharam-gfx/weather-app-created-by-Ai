import React, { useState, useEffect } from 'react';
import CitySearch from './CitySearch';
import CurrentWeather from './CurrentWeather';
import TemperatureToggle from './TemperatureToggle';
import ForecastToggle from './ForecastToggle';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherMap from './WeatherMap';
import LoadingSpinner from './LoadingSpinner';
import { getWeather, getForecast, getWeatherByCoordinates, getForecastByCoordinates } from '../services/weatherService';
import { reverseGeocode } from '../services/geocodingService';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface HourlyForecastData {
  dateTime: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  chanceOfRain: number;
}

interface DailyForecastData {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  chanceOfRain: number;
  sunrise: string;
  sunset: string;
}

interface ForecastData {
  cityName: string;
  current: WeatherData;
  hourlyForecast: HourlyForecastData[];
  dailyForecast: DailyForecastData[];
}

const WeatherDashboard: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [searchedCityName, setSearchedCityName] = useState<string>(''); // To store the city name that was searched
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C'); // C for Celsius, F for Fahrenheit
  const [activeView, setActiveView] = useState<'current' | 'hourly' | 'daily' | 'map'>('current');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to get current location weather
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null); // Clear any previous errors
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // First, try to get the location name to update the city field
            const locationData = await reverseGeocode(latitude, longitude);
            if (locationData) {
              const cityName = `${locationData.city}, ${locationData.country}`;
              setCity(cityName);
              // Save this as the last searched city
              localStorage.setItem('lastSearchedCity', cityName);
            }
          } catch (error) {
            console.error("Error getting location name:", error);
          }
          
          // Use the existing handleLocationClick function to fetch weather for current location
          handleLocationClick(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          
          // Create user-friendly error messages based on the error code
          let errorMessage = 'Unable to get your current location. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access was denied. Please check your browser settings or search for a city manually.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Please search for a city manually.';
              break;
            case error.TIMEOUT:
              errorMessage += 'The location request timed out. Please try again or search for a city manually.';
              break;
            default:
              errorMessage += 'Please search for a city manually.';
          }
          
          // Fall back to last searched city if geolocation fails
          const lastCity = localStorage.getItem('lastSearchedCity');
          if (lastCity) {
            setCity(lastCity);
            handleSearch(lastCity);
            // We'll show a more gentle error since we're falling back to last city
            setError(`${errorMessage} Showing weather for your last search instead.`);
          } else {
            setError(errorMessage);
            setLoading(false);
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      // Geolocation not supported, fall back to last searched city
      const lastCity = localStorage.getItem('lastSearchedCity');
      if (lastCity) {
        setCity(lastCity);
        handleSearch(lastCity);
      } else {
        setError('Geolocation is not supported by your browser. Please search for a city manually.');
      }
    }
  };

  useEffect(() => {
    // Get weather for current location on app load
    getCurrentLocationWeather();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSearch = async (searchCity: string) => {
    if (!searchCity.trim()) {
      setError('City name cannot be empty.');
      setWeather(null);
      setForecastData(null);
      setSearchedCityName(''); // Clear searched city name on error
      setCoordinates(null);
      return;
    }
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecastData(null);
    setCoordinates(null);
    // setCity(searchCity); // Update the input field city, or keep it as is based on UX preference
    try {
      // Fetch both current weather and forecast data
      const [currentData, forecast] = await Promise.all([
        getWeather(searchCity),
        getForecast(searchCity, 5)
      ]);      
      setWeather(currentData);
      setForecastData(forecast);
      setSearchedCityName(searchCity); // Set the successfully searched city name
      localStorage.setItem('lastSearchedCity', searchCity);
      
      // Extract coordinates from weather response
      setCoordinates({ lat: currentData.latitude, lng: currentData.longitude });
      
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name or your network connection.');
      setWeather(null);
      setForecastData(null);
      setSearchedCityName(''); // Clear searched city name on error
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'C' ? 'F' : 'C'));
  };

  const convertTemperature = (tempC: number): number => {
    if (unit === 'F') {
      return (tempC * 9/5) + 32;
    }
    return tempC;
  };  
  const handleLocationClick = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecastData(null);
    setCoordinates({ lat, lng });

    try {
      // Get city name from coordinates
      const locationData = await reverseGeocode(lat, lng);
      const cityName = locationData ? `${locationData.city}, ${locationData.country}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      // Fetch both current weather and forecast data by coordinates
      const [currentData, forecast] = await Promise.all([
        getWeatherByCoordinates(lat, lng),
        getForecastByCoordinates(lat, lng, 5)
      ]);
      
      setWeather(currentData);
      setForecastData(forecast);
      setSearchedCityName(cityName);
      setActiveView('current'); // Switch to current view to show the weather
    } catch (err) {
      setError('Failed to fetch weather data for this location. Please try another location.');
      setWeather(null);
      setForecastData(null);
      setSearchedCityName('');
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 50%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            color:'white',
            marginBottom: '8px',
            textShadow: '0 4px 12px rgba(192,192,192,0.6), 0 2px 8px rgba(255,255,255,0.4)',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
            letterSpacing: '-0.02em'
          }}>
            ☀️ Weather Dashboard
          </h1>          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: '400',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Your personal weather companion
          </p>
        </div>

        {/* Search Section */}
        <div className="glass animate-slide-in" style={{
          padding: '24px',
          marginBottom: '24px',
          borderRadius: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <div style={{ flexGrow: 1 }}>
              <CitySearch onSearch={handleSearch} initialCity={city} />
            </div>
          </div>
        </div>
        
        {/* Controls Section */}
        {weather && (
          <div className="glass animate-slide-in" style={{
            padding: '20px',
            marginBottom: '24px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <ForecastToggle activeView={activeView} onViewChange={setActiveView} />
            <TemperatureToggle unit={unit} onToggle={toggleUnit} />
          </div>
        )}
          {/* Loading State */}
        {loading && <LoadingSpinner message="Finding your location and weather data..." />}

        {/* Error State */}
        {error && (
          <div className="animate-slide-in" style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            color: 'white',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{error}</p>
          </div>
        )}
        
        {/* Weather Content */}
        {weather && searchedCityName && (
          <div className="animate-fade-in">
            {activeView === 'current' && (
              <CurrentWeather
                temperature={convertTemperature(weather.temperature)}
                condition={weather.condition}
                humidity={weather.humidity}
                windSpeed={weather.windSpeed}
                icon={weather.icon}
                unit={unit}
                cityName={searchedCityName}
              />
            )}
            
            {activeView === 'hourly' && forecastData && (
              <HourlyForecast
                hourlyForecast={forecastData.hourlyForecast}
                unit={unit}
              />
            )}
            
            {activeView === 'daily' && forecastData && (
              <DailyForecast
                dailyForecast={forecastData.dailyForecast}
                unit={unit}
              />
            )}
            
            {activeView === 'map' && (
              <WeatherMap
                latitude={coordinates?.lat}
                longitude={coordinates?.lng}
                cityName={searchedCityName}
                temperature={weather ? convertTemperature(weather.temperature) : undefined}
                condition={weather?.condition}
                icon={weather?.icon}
                unit={unit}
                onLocationClick={handleLocationClick}
              />
            )}
          </div>
        )}
      </div>

      {/* Add spinning animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default WeatherDashboard;
