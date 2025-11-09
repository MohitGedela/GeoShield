import React from 'react';
import { MapPin, Users, Navigation } from 'lucide-react';

const SafeZonesList = ({ safeZones }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'Hospital':
        return 'bg-red-100 text-red-800';
      case 'Shelter':
        return 'bg-blue-100 text-blue-800';
      case 'Aid Station':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openNavigation = (zone) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4">Nearby Safe Zones</h2>
      
      {safeZones.length === 0 ? (
        <p className="text-gray-500 text-sm">No safe zones found</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {safeZones.map((zone) => (
            <div key={zone.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">{zone.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${getTypeColor(zone.type)}`}>
                  {zone.type}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {zone.address}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {zone.occupancy}/{zone.capacity}
                </span>
                <span>
                  {Math.round((zone.occupancy / zone.capacity) * 100)}% full
                </span>
              </div>
              <button
                onClick={() => openNavigation(zone)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-3 h-3" />
                Get Directions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafeZonesList;

