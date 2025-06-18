import React from 'react';

interface LoadingSpinnerProps {
  message?: string; // Optional custom message
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Fetching Weather Data" }) => {
  return (
    <div className="glass animate-pulse" style={{
      padding: '60px 40px',
      textAlign: 'center',
      borderRadius: '24px',
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      
    }}>
      {/* Weather-themed spinner */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          animation: 'spin 2s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
        }}>
          ☀️
        </div>
        
        {/* Orbiting elements */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100px',
          height: '100px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'orbit 3s linear infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ☁️
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div>
        <h3 style={{
          color: 'white',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {message}
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1rem',
          fontWeight: '300',
          margin: 0
        }}>
          Getting the latest forecast for you...
        </p>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
            }}
          />
        ))}
      </div>

      {/* Keyframe animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes orbit {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
