// Weather service to make API calls directly to OpenWeatherMap

interface WeatherData {
    temperature: number; // Celsius from backend
    condition: string;
    humidity: number;
    windSpeed: number; // kph from backend
    icon: string; // Icon code from API
    latitude: number;
    longitude: number;
}

interface HourlyForecast {
    dateTime: string;
    temperature: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    chanceOfRain: number;
}

interface DailyForecast {
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
    hourlyForecast: HourlyForecast[];
    dailyForecast: DailyForecast[];
}

// OpenWeatherMap API interfaces
interface OpenWeatherMapCurrentResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type?: number;
        id?: number;
        country?: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

interface OpenWeatherMapForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            sea_level: number;
            grnd_level: number;
            humidity: number;
            temp_kf: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        clouds: {
            all: number;
        };
        wind: {
            speed: number;
            deg: number;
            gust?: number;
        };
        visibility: number;
        pop: number;
        rain?: {
            '3h': number;
        };
        sys: {
            pod: string;
        };
        dt_txt: string;
    }>;
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

// API configuration for OpenWeatherMap
const OPENWEATHERMAP_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || ''; // Get API key from environment
const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function to validate required API keys
const validateApiKey = (): void => {
  if (!OPENWEATHERMAP_API_KEY) {
    console.error('OpenWeatherMap API key is missing! Please add it to your .env file as REACT_APP_OPENWEATHER_API_KEY');
    throw new Error('Weather API key is missing. Please check your environment configuration.');
  }
};

// Helper function to convert m/s to kph
const convertMeterPerSecToKph = (mps: number): number => {
    return mps * 3.6; // 1 m/s = 3.6 km/h
};

// Helper function to get icon URL (used in component rendering)
export const getIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getWeather = async (city: string): Promise<WeatherData> => {
    console.log(`Fetching weather for ${city} directly from OpenWeatherMap API`);
    
    try {
        validateApiKey();
        const response = await fetch(`${OPENWEATHERMAP_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Weather data for "${city}" not found. Please check the city name.`);
            } else if (response.status === 400) {
                throw new Error('Invalid request. Please check the city name.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data: OpenWeatherMapCurrentResponse = await response.json();
        
        // Map OpenWeatherMap response to our interface
        return {
            temperature: data.main.temp,
            condition: data.weather[0]?.description || 'Unknown',
            humidity: data.main.humidity,
            windSpeed: convertMeterPerSecToKph(data.wind.speed),
            icon: data.weather[0]?.icon || '',
            latitude: data.coord.lat,
            longitude: data.coord.lon,
        };
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Re-throw with a user-friendly message if it's not already user-friendly
        if (error instanceof Error) {
            throw error;
        }
        
        // Handle network errors or other issues
        throw new Error('Unable to fetch weather data. Please check your internet connection and try again.');
    }
};

export const getForecast = async (city: string, days: number = 5): Promise<ForecastData> => {
    console.log(`Fetching forecast for ${city} (${days} days) directly from OpenWeatherMap API`);
    
    try {
        validateApiKey(); // Validate API key presence
        
        // Get current weather first
        const currentWeatherResponse = await fetch(`${OPENWEATHERMAP_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        
        if (!currentWeatherResponse.ok) {
            if (currentWeatherResponse.status === 404) {
                throw new Error(`Weather data for "${city}" not found. Please check the city name.`);
            } else {
                throw new Error(`HTTP error! status: ${currentWeatherResponse.status}`);
            }
        }
        
        const currentWeatherData: OpenWeatherMapCurrentResponse = await currentWeatherResponse.ok ? await currentWeatherResponse.json() : null;
        
        // Get forecast data
        const forecastResponse = await fetch(`${OPENWEATHERMAP_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            if (forecastResponse.status === 404) {
                throw new Error(`Forecast data for "${city}" not found. Please check the city name.`);
            } else {
                throw new Error(`HTTP error! status: ${forecastResponse.status}`);
            }
        }
        
        const forecastData: OpenWeatherMapForecastResponse = await forecastResponse.json();
        
        // Process the data to create hourly and daily forecasts
        const hourlyForecast: HourlyForecast[] = forecastData.list.slice(0, 24).map(item => ({
            dateTime: new Date(item.dt * 1000).toISOString(),
            temperature: item.main.temp,
            condition: item.weather[0]?.description || 'Unknown',
            icon: item.weather[0]?.icon || '',
            humidity: item.main.humidity,
            windSpeed: convertMeterPerSecToKph(item.wind.speed),
            chanceOfRain: item.pop * 100, // pop is probability of precipitation (0-1)
        }));
        
        // Group forecast data by day for daily forecast
        const dailyData: { [key: string]: any[] } = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = [];
            }
            dailyData[date].push(item);
        });
        
        // Create daily forecast from grouped data
        const dailyForecast: DailyForecast[] = Object.keys(dailyData).slice(0, days).map(date => {
            const dayData = dailyData[date];
            const temperatures = dayData.map(item => item.main.temp);
            const maxTemp = Math.max(...temperatures);
            const minTemp = Math.min(...temperatures);
            
            // Use the noon forecast for the day's condition (or the middle of available forecasts)
            const midDayForecast = dayData[Math.floor(dayData.length / 2)];
            
            return {
                date,
                maxTemperature: maxTemp,
                minTemperature: minTemp,
                condition: midDayForecast.weather[0]?.description || 'Unknown',
                icon: midDayForecast.weather[0]?.icon || '',
                humidity: midDayForecast.main.humidity,
                windSpeed: convertMeterPerSecToKph(midDayForecast.wind.speed),
                chanceOfRain: Math.max(...dayData.map(item => item.pop || 0)) * 100,
                sunrise: new Date(forecastData.city.sunrise * 1000).toISOString(),
                sunset: new Date(forecastData.city.sunset * 1000).toISOString(),
            };
        });
        
        return {
            cityName: forecastData.city.name,
            current: {
                temperature: currentWeatherData.main.temp,
                condition: currentWeatherData.weather[0]?.description || 'Unknown',
                humidity: currentWeatherData.main.humidity,
                windSpeed: convertMeterPerSecToKph(currentWeatherData.wind.speed),
                icon: currentWeatherData.weather[0]?.icon || '',
                latitude: currentWeatherData.coord.lat,
                longitude: currentWeatherData.coord.lon,
            },
            hourlyForecast,
            dailyForecast,
        };
        
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        
        // Re-throw with a user-friendly message if it's not already user-friendly
        if (error instanceof Error) {
            throw error;
        }
        
        // Handle network errors or other issues
        throw new Error('Unable to fetch forecast data. Please check your internet connection and try again.');
    }
};

export const getHourlyForecast = async (city: string, hours: number = 24): Promise<HourlyForecast[]> => {
    console.log(`Fetching hourly forecast for ${city} (${hours} hours) directly from OpenWeatherMap API`);
    
    try {
        validateApiKey(); // Validate API key presence
        
        const forecastResponse = await fetch(`${OPENWEATHERMAP_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            if (forecastResponse.status === 404) {
                throw new Error(`Hourly forecast data for "${city}" not found. Please check the city name.`);
            } else {
                throw new Error(`HTTP error! status: ${forecastResponse.status}`);
            }
        }
        
        const forecastData: OpenWeatherMapForecastResponse = await forecastResponse.json();
        
        // Map to hourly forecast and limit to requested hours
        const hourlyForecast: HourlyForecast[] = forecastData.list.slice(0, hours).map(item => ({
            dateTime: new Date(item.dt * 1000).toISOString(),
            temperature: item.main.temp,
            condition: item.weather[0]?.description || 'Unknown',
            icon: item.weather[0]?.icon || '',
            humidity: item.main.humidity,
            windSpeed: convertMeterPerSecToKph(item.wind.speed),
            chanceOfRain: item.pop * 100, // pop is probability of precipitation (0-1)
        }));
        
        return hourlyForecast;
        
    } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
        
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error('Unable to fetch hourly forecast data. Please check your internet connection and try again.');
    }
};

// Get weather by coordinates (latitude, longitude)
export const getWeatherByCoordinates = async (latitude: number, longitude: number): Promise<WeatherData> => {
    try {
        validateApiKey(); // Validate API key presence
        const response = await fetch(`${OPENWEATHERMAP_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Weather data for coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)} not found.`);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data: OpenWeatherMapCurrentResponse = await response.json();
        
        // Map OpenWeatherMap response to our interface
        return {
            temperature: data.main.temp,
            condition: data.weather[0]?.description || 'Unknown',
            humidity: data.main.humidity,
            windSpeed: convertMeterPerSecToKph(data.wind.speed),
            icon: data.weather[0]?.icon || '',
            latitude: data.coord.lat,
            longitude: data.coord.lon,
        };
        
    } catch (error) {
        console.error('Error fetching weather data by coordinates:', error);
        throw error;
    }
};

// Get forecast by coordinates (latitude, longitude)
export const getForecastByCoordinates = async (latitude: number, longitude: number, days: number = 5): Promise<ForecastData> => {
    try {
        validateApiKey(); // Validate API key presence
        // Get current weather first
        const currentWeatherResponse = await fetch(`${OPENWEATHERMAP_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        
        if (!currentWeatherResponse.ok) {
            throw new Error(`Weather data for coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)} not found.`);
        }
        
        const currentWeatherData: OpenWeatherMapCurrentResponse = await currentWeatherResponse.json();
        
        // Get forecast data
        const forecastResponse = await fetch(`${OPENWEATHERMAP_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast data for coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)} not found.`);
        }
        
        const forecastData: OpenWeatherMapForecastResponse = await forecastResponse.json();
        
        // Process the data to create hourly and daily forecasts
        const hourlyForecast: HourlyForecast[] = forecastData.list.slice(0, 24).map(item => ({
            dateTime: new Date(item.dt * 1000).toISOString(),
            temperature: item.main.temp,
            condition: item.weather[0]?.description || 'Unknown',
            icon: item.weather[0]?.icon || '',
            humidity: item.main.humidity,
            windSpeed: convertMeterPerSecToKph(item.wind.speed),
            chanceOfRain: item.pop * 100, // pop is probability of precipitation (0-1)
        }));
        
        // Group forecast data by day for daily forecast
        const dailyData: { [key: string]: any[] } = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = [];
            }
            dailyData[date].push(item);
        });
        
        // Create daily forecast from grouped data
        const dailyForecast: DailyForecast[] = Object.keys(dailyData).slice(0, days).map(date => {
            const dayData = dailyData[date];
            const temperatures = dayData.map(item => item.main.temp);
            const maxTemp = Math.max(...temperatures);
            const minTemp = Math.min(...temperatures);
            
            // Use the noon forecast for the day's condition (or the middle of available forecasts)
            const midDayForecast = dayData[Math.floor(dayData.length / 2)];
            
            return {
                date,
                maxTemperature: maxTemp,
                minTemperature: minTemp,
                condition: midDayForecast.weather[0]?.description || 'Unknown',
                icon: midDayForecast.weather[0]?.icon || '',
                humidity: midDayForecast.main.humidity,
                windSpeed: convertMeterPerSecToKph(midDayForecast.wind.speed),
                chanceOfRain: Math.max(...dayData.map(item => item.pop || 0)) * 100,
                sunrise: new Date(forecastData.city.sunrise * 1000).toISOString(),
                sunset: new Date(forecastData.city.sunset * 1000).toISOString(),
            };
        });
        
        return {
            cityName: forecastData.city.name,
            current: {
                temperature: currentWeatherData.main.temp,
                condition: currentWeatherData.weather[0]?.description || 'Unknown',
                humidity: currentWeatherData.main.humidity,
                windSpeed: convertMeterPerSecToKph(currentWeatherData.wind.speed),
                icon: currentWeatherData.weather[0]?.icon || '',
                latitude: currentWeatherData.coord.lat,
                longitude: currentWeatherData.coord.lon,
            },
            hourlyForecast,
            dailyForecast,
        };
        
    } catch (error) {
        console.error('Error fetching forecast data by coordinates:', error);
        throw error;
    }
};
