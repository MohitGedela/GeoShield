import React, { useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { AlertCircle, Heart, MapPin, Home } from 'lucide-react';

const libraries = ['places'];

const MapComponent = ({
  center = { lat: 43.2557, lng: -79.8711 }, // Hamilton, ON
  zoom = 12,
  requests = [],
  safeZones = [],
  volunteers = [],
  onMapClick,
  selectedMarker = null,
  onMarkerClick,
  showRequests = true,
  showSafeZones = true,
  showVolunteers = false
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const getMarkerColor = (urgency, status) => {
    if (status === 'Fulfilled') return '🟢';
    if (urgency === 'Urgent') return '🔴';
    if (urgency === 'High') return '🟡';
    return '🟢';
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }), []);

  const onLoad = useCallback((map) => {
    // Map loaded
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={onLoad}
      onClick={onMapClick}
    >
      {showRequests && requests.map((request) => (
        <Marker
          key={request.id}
          position={{ lat: request.lat, lng: request.lng }}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${request.status === 'Fulfilled' ? '#10B981' : request.urgency === 'Urgent' ? '#DC2626' : request.urgency === 'High' ? '#F59E0B' : '#10B981'}" stroke="white" stroke-width="2"/>
                <text x="16" y="20" font-size="18" text-anchor="middle" fill="white">${getMarkerColor(request.urgency, request.status)}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32)
          }}
          onClick={() => onMarkerClick && onMarkerClick(request)}
        >
          {selectedMarker?.id === request.id && (
            <InfoWindow onCloseClick={() => onMarkerClick(null)}>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{request.type}</h3>
                <p className="text-xs text-gray-600">{request.survivorName}</p>
                <p className="text-xs">Urgency: {request.urgency}</p>
                <p className="text-xs">Status: {request.status}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}

      {showSafeZones && safeZones.map((zone) => (
        <Marker
          key={zone.id}
          position={{ lat: zone.lat, lng: zone.lng }}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#9333EA" stroke="white" stroke-width="2"/>
                <text x="16" y="20" font-size="18" text-anchor="middle" fill="white">📍</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32)
          }}
          onClick={() => onMarkerClick && onMarkerClick(zone)}
        >
          {selectedMarker?.id === zone.id && (
            <InfoWindow onCloseClick={() => onMarkerClick(null)}>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{zone.name}</h3>
                <p className="text-xs text-gray-600">{zone.type}</p>
                <p className="text-xs">Capacity: {zone.occupancy}/{zone.capacity}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}

      {showVolunteers && volunteers.map((volunteer) => (
        <Marker
          key={volunteer.id}
          position={{ lat: volunteer.lat, lng: volunteer.lng }}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#2563EB" stroke="white" stroke-width="2"/>
                <text x="16" y="20" font-size="18" text-anchor="middle" fill="white">🔵</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32)
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;

