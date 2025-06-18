import React, { useState } from 'react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  initialCity: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSearch, initialCity }) => {
  const [city, setCity] = useState(initialCity);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-in">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            color: isFocused || city ? '#667eea' : 'rgba(255, 255, 255, 0.6)',
            transition: 'color 0.3s ease',
            zIndex: 1
          }}>
            🔍
          </div>
          
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter city name (e.g., London, New York, Tokyo)"
            style={{
              width: '100%',
              padding: '16px 20px 16px 50px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: isFocused ? '2px solid #667eea' : '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              fontSize: '16px',
              outline: 'none',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: isFocused ? '0 8px 32px rgba(102, 126, 234, 0.3)' : '0 4px 16px rgba(0,0,0,0.1)'
            }}
          />
          
          {/* Placeholder styling */}
          <style>
            {`
              input::placeholder {
                color: rgba(255, 255, 255, 0.7);
                font-weight: 300;
              }
              input:focus::placeholder {
                color: rgba(255, 255, 255, 0.5);
              }
            `}
          </style>
        </div>

        <button 
          type="submit" 
          disabled={!city.trim()}
          style={{
            padding: '14px 32px',
            background: city.trim() 
              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: city.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: city.trim() 
              ? '0 8px 25px rgba(102, 126, 234, 0.4)' 
              : 'none',
            transform: city.trim() ? 'translateY(0)' : 'none',
            minWidth: '120px',
            opacity: city.trim() ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (city.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (city.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {city.trim() ? '🌤️ Get Weather' : '✨ Search'}
        </button>
      </div>
    </form>
  );
};

export default CitySearch;
