import React from 'react';
import { getIconUrl } from '../services/weatherService';

interface HourlyForecastItem {
    dateTime: string;
    temperature: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    chanceOfRain: number;
}

interface Props {
    hourlyForecast: HourlyForecastItem[];
    unit: 'C' | 'F';
}

const HourlyForecast: React.FC<Props> = ({ hourlyForecast, unit }) => {
    const convertTemperature = (tempC: number): number => {
        if (unit === 'F') {
            return (tempC * 9/5) + 32;
        }
        return tempC;
    };

    const formatTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        const now = new Date();
        
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            });
        }
        
        return date.toLocaleString('en-US', { 
            hour: 'numeric', 
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    };

    const getWeatherIcon = (iconCode: string) => {
        const iconMap: { [key: string]: string } = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        
        return iconMap[iconCode] || '🌤️';
    };

    const isNow = (dateTimeString: string): boolean => {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diffInHours = Math.abs(date.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffInHours < 1;
    };

    return (
        <div className="glass animate-fade-in" style={{ 
            padding: '24px',
            borderRadius: '24px',
            margin: '20px 0'
        }}>
            <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '24px', 
                color: 'white',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                ⏰ Hourly Forecast
            </h3>
            
            <div style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '16px', 
                padding: '8px',
                scrollbarWidth: 'thin',
                scrollPadding: '16px'
            }}>
                {hourlyForecast.slice(0, 12).map((hour, index) => {
                    const isCurrentHour = isNow(hour.dateTime);
                    
                    return (
                        <div 
                            key={index}
                            className={isCurrentHour ? 'animate-pulse' : ''}
                            style={{
                                minWidth: '120px',
                                textAlign: 'center',
                                padding: '16px 12px',
                                borderRadius: '16px',
                                background: isCurrentHour 
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: isCurrentHour 
                                    ? '2px solid rgba(255, 255, 255, 0.5)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: isCurrentHour 
                                    ? '0 8px 25px rgba(102, 126, 234, 0.4)'
                                    : '0 4px 16px rgba(0,0,0,0.1)',
                                transform: isCurrentHour ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                if (!isCurrentHour) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isCurrentHour) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }
                            }}
                        >
                            <div style={{ 
                                fontSize: '0.8rem', 
                                fontWeight: '600', 
                                color: isCurrentHour ? 'white' : 'rgba(255, 255, 255, 0.9)', 
                                marginBottom: '12px',
                                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                            }}>
                                {isCurrentHour ? 'Now' : formatTime(hour.dateTime)}
                            </div>
                            
                            <div style={{ 
                                fontSize: '2.5rem', 
                                margin: '12px 0',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}>
                                {getWeatherIcon(hour.icon)}
                                <img 
                                    src={getIconUrl(hour.icon)} 
                                    alt={hour.condition}
                                    style={{ 
                                        width: '40px', 
                                        height: '40px',
                                        marginTop: '4px'
                                    }}
                                />
                            </div>
                            
                            <div style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '700', 
                                color: 'white', 
                                marginBottom: '8px',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}>
                                {Math.round(convertTemperature(hour.temperature))}°{unit}
                            </div>
                            
                            <div style={{ 
                                fontSize: '0.7rem', 
                                color: isCurrentHour ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)', 
                                marginBottom: '8px',
                                textTransform: 'capitalize',
                                lineHeight: '1.2'
                            }}>
                                {hour.condition.length > 12 ? hour.condition.slice(0, 12) + '...' : hour.condition}
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                fontSize: '0.7rem', 
                                color: isCurrentHour ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                                gap: '8px'
                            }}>
                                <span>🌧️ {Math.round(hour.chanceOfRain)}%</span>
                                <span>💧 {hour.humidity}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Custom scrollbar styles */}
            <style>
                {`
                    div::-webkit-scrollbar {
                        height: 8px;
                    }
                    div::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.5);
                    }
                `}
            </style>
        </div>
    );
};

export default HourlyForecast;
