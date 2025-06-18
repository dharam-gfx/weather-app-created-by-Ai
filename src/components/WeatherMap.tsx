import React, { useEffect, useRef, useState } from 'react';

interface WeatherMapProps {
  latitude?: number;
  longitude?: number;
  cityName?: string;
  temperature?: number;
  condition?: string;
  icon?: string;
  unit: 'C' | 'F';
  onLocationClick?: (lat: number, lng: number) => void;
}

const WeatherMap: React.FC<WeatherMapProps> = ({
  latitude,
  longitude,
  cityName,
  temperature,
  condition,
  icon,
  unit,
  onLocationClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      console.log('Google Maps API Key:', apiKey ? 'API key loaded' : 'API key missing');
      
      if (!apiKey) {
        console.error('Google Maps API key is missing. Please check your .env file.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York as default
    const center = latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: center,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9d3e6' }]
        }
      ]
    });

    setMap(mapInstance);    // Add click listener for location selection
    if (onLocationClick) {
      mapInstance.addListener('click', (event: any) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat !== undefined && lng !== undefined) {
          onLocationClick(lat, lng);
        }
      });
    }

    return () => {
      // Cleanup
      if (mapInstance) {
        window.google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [isLoaded, onLocationClick]);

  // Update marker and info window when location changes
  useEffect(() => {
    if (!map || !latitude || !longitude) return;

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Remove existing info window
    if (infoWindow) {
      infoWindow.close();
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: cityName || 'Weather Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
              ${temperature ? Math.round(temperature) : '--'}°
            </text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      }
    });

    // Create info window content
    const infoContent = `
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
          ${cityName || 'Unknown Location'}
        </h3>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <img src="https://openweathermap.org/img/w/${icon || '01d'}.png" 
               alt="${condition || 'Weather'}" 
               style="width: 32px; height: 32px;"/>
          <div>
            <div style="font-size: 18px; font-weight: bold; color: #1f2937;">
              ${temperature ? Math.round(temperature) : '--'}°${unit}
            </div>
            <div style="font-size: 12px; color: #6b7280; text-transform: capitalize;">
              ${condition || 'Unknown'}
            </div>
          </div>
        </div>
        <div style="font-size: 11px; color: #9ca3af;">
          Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}
        </div>
      </div>
    `;

    const newInfoWindow = new window.google.maps.InfoWindow({
      content: infoContent
    });

    // Show info window on marker click
    newMarker.addListener('click', () => {
      newInfoWindow.open(map, newMarker);
    });

    // Auto-open info window if we have weather data
    if (temperature !== undefined) {
      newInfoWindow.open(map, newMarker);
    }

    setMarker(newMarker);
    setInfoWindow(newInfoWindow);

    // Center map on the new location
    map.setCenter({ lat: latitude, lng: longitude });
    map.setZoom(12);

  }, [map, latitude, longitude, cityName, temperature, condition, icon, unit]);

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        margin: '16px 0'
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Map Integration Available</h3>
        <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>
          To enable map features, add REACT_APP_GOOGLE_MAPS_API_KEY to your environment variables
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      margin: '16px 0'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        color: 'white',
        padding: '16px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        📍 Weather Map
        {onLocationClick && (
          <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px', opacity: 0.9 }}>
            Click anywhere on the map to get weather for that location
          </div>
        )}
      </div>
      
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          position: 'relative'
        }}
      />
      
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading map...
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default WeatherMap;
