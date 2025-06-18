import React from 'react';
import { getIconUrl } from '../services/weatherService';

interface CurrentWeatherProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  unit: 'C' | 'F';
  cityName: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  temperature, 
  condition, 
  humidity, 
  windSpeed, 
  icon, 
  unit, 
  cityName 
}) => {
  // Enhanced weather icon mapping with better emojis and fallback
  const getWeatherIcon = (iconCode: string, condition: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '�️'
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  // Use both emoji and actual weather icon
  const weatherIcon = getWeatherIcon(icon, condition);
  const iconUrl = getIconUrl(icon);
  
  // Dynamic background based on weather condition
  // const getBackgroundGradient = (iconCode: string) => {
  //   if (iconCode.includes('01')) return 'linear-gradient(135deg, #FDB99B, #CF8BF3, #FDB99B)';
  //   if (iconCode.includes('02') || iconCode.includes('03')) return 'linear-gradient(135deg, #A8EDEA, #FED6E3)';
  //   if (iconCode.includes('04')) return 'linear-gradient(135deg, #D3CCE3, #E9E4F0)';
  //   if (iconCode.includes('09') || iconCode.includes('10')) return 'linear-gradient(135deg, #89CFF0, #667eea)';
  //   if (iconCode.includes('11')) return 'linear-gradient(135deg, #434343, #000000)';
  //   if (iconCode.includes('13')) return 'linear-gradient(135deg, #E6DEDD, #D1D1D1)';
  //   if (iconCode.includes('50')) return 'linear-gradient(135deg, #BDC3C7, #2C3E50)';
  //   return 'linear-gradient(135deg, #667eea, #764ba2)';
  // };

  return (
    <div className="glass animate-fade-in" style={{
      color: 'white',
      padding: '32px',
      borderRadius: '24px',
      margin: '20px 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '120px',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>

      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '600', 
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📍 {cityName}
        </h2>
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.9,
          fontWeight: '300'
        }}>
          Current Weather Conditions
        </p>
      </div>

      {/* Main Weather Display */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Weather Icon and Temperature */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <div className="animate-float" style={{ 
            fontSize: '5rem', 
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            {weatherIcon}
            <img 
              src={iconUrl} 
              alt={condition}
              style={{ 
                width: '80px', 
                height: '80px',
                marginTop: '10px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ 
              fontSize: '4rem', 
              fontWeight: '700',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              {Math.round(temperature)}
            </span>
            <span style={{ 
              fontSize: '2rem', 
              fontWeight: '400',
              opacity: 0.8
            }}>
              °{unit}
            </span>
          </div>
          <p style={{ 
            fontSize: '1.4rem', 
            textTransform: 'capitalize',
            fontWeight: '500',
            marginTop: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {condition}
          </p>
        </div>

        {/* Weather Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div className="glass" style={{
            padding: '16px',
            borderRadius: '16px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💧</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{humidity}%</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Humidity</div>
          </div>
          
          <div className="glass" style={{
            padding: '16px',
            borderRadius: '16px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💨</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{windSpeed.toFixed(1)}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
