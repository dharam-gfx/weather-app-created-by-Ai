import React from 'react';
import { getIconUrl } from '../services/weatherService';

interface DailyForecastItem {
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

interface Props {
    dailyForecast: DailyForecastItem[];
    unit: 'C' | 'F';
}

const DailyForecast: React.FC<Props> = ({ dailyForecast, unit }) => {
    const convertTemperature = (tempC: number): number => {
        if (unit === 'F') {
            return (tempC * 9/5) + 32;
        }
        return tempC;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
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

    const formatTime = (timeString: string): string => {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const isToday = (dateString: string): boolean => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
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
                📅 5-Day Forecast
            </h3>
            
            <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {dailyForecast.map((day, index) => {
                    const todayForecast = isToday(day.date);
                    
                    return (
                        <div 
                            key={index}
                            className={todayForecast ? 'animate-pulse' : ''}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 60px 120px 80px 1fr',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderRadius: '16px',
                                background: todayForecast 
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: todayForecast 
                                    ? '2px solid rgba(255, 255, 255, 0.5)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: todayForecast 
                                    ? '0 8px 25px rgba(102, 126, 234, 0.4)'
                                    : '0 4px 16px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                gap: '16px'
                            }}
                            onMouseEnter={(e) => {
                                if (!todayForecast) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!todayForecast) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {/* Day */}
                            <div>
                                <div style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    marginBottom: '4px',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                    {todayForecast ? '✨ Today' : formatDate(day.date)}
                                </div>
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textTransform: 'capitalize'
                                }}>
                                    {day.condition}
                                </div>
                            </div>

                            {/* Weather Icon */}
                            <div style={{ 
                                textAlign: 'center',
                                fontSize: '2.5rem',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}>
                                {getWeatherIcon(day.icon)}
                                <img 
                                    src={getIconUrl(day.icon)} 
                                    alt={day.condition}
                                    style={{ 
                                        width: '40px', 
                                        height: '40px',
                                        marginTop: '4px'
                                    }}
                                />
                            </div>

                            {/* Temperature Range */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ 
                                        fontSize: '1.2rem', 
                                        fontWeight: '700', 
                                        color: 'white',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                        {Math.round(convertTemperature(day.maxTemperature))}°
                                    </span>
                                    <span style={{ 
                                        fontSize: '1rem', 
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                        {Math.round(convertTemperature(day.minTemperature))}°
                                    </span>
                                </div>
                            </div>

                            {/* Rain Chance */}
                            <div style={{ 
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}>
                                <div style={{ marginBottom: '4px' }}>🌧️</div>
                                <div>{Math.round(day.chanceOfRain)}%</div>
                            </div>

                            {/* Additional Info */}
                            <div style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>🌅</span>
                                    <span>{formatTime(day.sunrise)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>🌇</span>
                                    <span>{formatTime(day.sunset)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>💧</span>
                                    <span>{day.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile responsive styles */}
            <style>
                {`
                    @media (max-width: 768px) {
                        div[style*="grid-template-columns"] {
                            grid-template-columns: 1fr 50px 100px 60px 80px !important;
                            gap: 8px !important;
                            padding: 12px 16px !important;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        div[style*="grid-template-columns"] {
                            grid-template-columns: 1fr 40px 80px 50px !important;
                            gap: 6px !important;
                            padding: 10px 12px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default DailyForecast;
