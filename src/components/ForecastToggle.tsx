import React from 'react';

interface Props {
    activeView: 'current' | 'hourly' | 'daily' | 'map';
    onViewChange: (view: 'current' | 'hourly' | 'daily' | 'map') => void;
}

const ForecastToggle: React.FC<Props> = ({ activeView, onViewChange }) => {
    const tabs = [
        { id: 'current', label: '🌤️ Current', emoji: '🌤️' },
        { id: 'hourly', label: '⏰ Hourly', emoji: '⏰' },
        { id: 'daily', label: '📅 5-Day', emoji: '📅' },
        { id: 'map', label: '🗺️ Map', emoji: '🗺️' }
    ];

    const buttonStyle = (isActive: boolean) => ({
        padding: '12px 20px',
        background: isActive 
            ? 'linear-gradient(135deg, #667eea, #764ba2)' 
            : 'rgba(255, 255, 255, 0.1)',
        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
        border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: isActive 
            ? '0 8px 25px rgba(102, 126, 234, 0.4)' 
            : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
        minWidth: '100px'
    });

    return (
        <div style={{ 
            display: 'flex', 
            gap: '12px', 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            padding: '8px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    style={buttonStyle(activeView === tab.id)}
                    onClick={() => onViewChange(tab.id as any)}
                    onMouseEnter={(e) => {
                        if (activeView !== tab.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== tab.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ForecastToggle;
