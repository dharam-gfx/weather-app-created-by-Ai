import React from 'react';
// import logo from './logo.svg'; // Not needed for the dashboard
import './App.css';
import WeatherDashboard from './components/WeatherDashboard'; // Import the WeatherDashboard

function App() {
  // Debug environment variables
  console.log('Environment variables check:');
  // We now call OpenWeatherMap API directly, so we don't need REACT_APP_API_URL
  console.log('Using direct OpenWeatherMap API integration');
  console.log('REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
  
  return (
    <div className="App">
      <WeatherDashboard /> {/* Render the WeatherDashboard component */}
    </div>
  );
}

export default App;
