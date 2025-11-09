import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Map/MapComponent';
import StatsOverview from './StatsOverview';
import ResourceManagement from './ResourceManagement';
import AlertSystem from './AlertSystem';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const { requests, safeZones, volunteers } = useApp();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showResources, setShowResources] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hover:bg-orange-700 p-2 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Coordinator Dashboard</h1>
        </div>
        <button
          onClick={() => setShowResources(!showResources)}
          className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800"
        >
          {showResources ? 'Hide' : 'Show'} Resources
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map Section - 60% */}
        <div className="flex-1 relative" style={{ width: '60%' }}>
          <MapComponent
            center={{ lat: 43.2557, lng: -79.8711 }}
            requests={requests}
            safeZones={safeZones}
            volunteers={volunteers}
            selectedMarker={selectedMarker}
            onMarkerClick={setSelectedMarker}
            showRequests={true}
            showSafeZones={true}
            showVolunteers={true}
          />
        </div>

        {/* Stats Panel - 40% */}
        <div className="w-2/5 bg-gray-50 overflow-y-auto p-6">
          <StatsOverview
            requests={requests}
            volunteers={volunteers}
            safeZones={safeZones}
          />
          
          {showResources && (
            <div className="mt-6">
              <ResourceManagement safeZones={safeZones} />
            </div>
          )}

          <div className="mt-6">
            <AlertSystem requests={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

