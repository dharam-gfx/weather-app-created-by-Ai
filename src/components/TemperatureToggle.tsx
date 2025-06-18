import React from 'react';

interface TemperatureToggleProps {
  unit: 'C' | 'F';
  onToggle: () => void;
}

const TemperatureToggle: React.FC<TemperatureToggleProps> = ({ unit, onToggle }) => {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '6px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={onToggle}
        style={{
          padding: '10px 16px',
          background: unit === 'C' 
            ? 'linear-gradient(135deg, #667eea, #764ba2)' 
            : 'transparent',
          color: unit === 'C' ? 'white' : 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          minWidth: '50px',
          boxShadow: unit === 'C' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
        }}
      >
        °C
      </button>
      <button
        onClick={onToggle}
        style={{
          padding: '10px 16px',
          background: unit === 'F' 
            ? 'linear-gradient(135deg, #667eea, #764ba2)' 
            : 'transparent',
          color: unit === 'F' ? 'white' : 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          minWidth: '50px',
          boxShadow: unit === 'F' ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
        }}
      >
        °F
      </button>
    </div>
  );
};

export default TemperatureToggle;
