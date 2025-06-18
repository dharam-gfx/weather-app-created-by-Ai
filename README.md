# Weather Dashboard Frontend

This is the frontend React application for the Weather Dashboard. It provides a user interface for viewing weather data and forecasts. This application was developed with the assistance of AI and completed within an hour!

## Features

- Current weather display
- Hourly and daily forecasts
- Interactive weather map
- City search functionality
- Temperature unit toggle (Celsius/Fahrenheit)
- Responsive design for all devices

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```

3. Add your API keys to the `.env` file:
   ```
   REACT_APP_OPENWEATHER_API_KEY=your_key_here
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
   ```

4. Start the development server:
   ```
   npm start
   ```

## Available Scripts

- `npm start`: Run the development server - opens [http://localhost:3000](http://localhost:3000) in your browser
- `npm test`: Run tests in interactive watch mode
- `npm run build`: Create an optimized production build

## Environment Variables

- `REACT_APP_OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key (required for map functionality)

## API Integration

This application directly interfaces with:
- OpenWeatherMap API for weather data
- Google Maps API for location mapping and geocoding

## Architecture

This frontend application is built with:
- React + TypeScript
- CSS for styling
- API services for data fetching
- React hooks for state management

## Learn More

- [React Documentation](https://reactjs.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Google Maps API](https://developers.google.com/maps/documentation)
