import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Map/MapComponent';
import RequestHelpForm from './RequestHelpForm';
import CheckInButton from './CheckInButton';
import MyRequestsList from './MyRequestsList';
import SafeZonesList from './SafeZonesList';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SurvivorDashboard = () => {
  const navigate = useNavigate();
  const { requests, safeZones, currentUser, setCurrentUser } = useApp();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 43.2557, lng: -79.8711 });

  // Get user's requests
  const myRequests = requests.filter(r => 
    r.survivorId === (currentUser?.id || 'surv1')
  );

  const handleMapClick = (e) => {
    if (e.latLng) {
      setMapCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hover:bg-red-700 p-2 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Survivor Dashboard</h1>
        </div>
        <CheckInButton />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map Section - 60% */}
        <div className="flex-1 relative" style={{ width: '60%' }}>
          <MapComponent
            center={mapCenter}
            requests={requests}
            safeZones={safeZones}
            onMapClick={handleMapClick}
            selectedMarker={selectedMarker}
            onMarkerClick={setSelectedMarker}
            showRequests={true}
            showSafeZones={true}
            showVolunteers={false}
          />
        </div>

        {/* Side Panel - 40% */}
        <div className="w-2/5 bg-gray-50 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <button
                onClick={() => setShowRequestForm(true)}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Request Help
              </button>
            </div>

            {/* My Active Requests */}
            <MyRequestsList requests={myRequests} />

            {/* Nearby Safe Zones */}
            <SafeZonesList safeZones={safeZones} />
          </div>
        </div>
      </div>

      {/* Request Help Modal */}
      {showRequestForm && (
        <RequestHelpForm
          onClose={() => setShowRequestForm(false)}
          mapCenter={mapCenter}
        />
      )}
    </div>
  );
};

export default SurvivorDashboard;

