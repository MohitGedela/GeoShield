import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Map/MapComponent';
import RequestHelpForm from '../Survivor/RequestHelpForm';
import MyRequestsList from '../Survivor/MyRequestsList';
import SafeZonesList from '../Survivor/SafeZonesList';
import { ArrowLeft, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { requests, safeZones, currentUser } = useApp();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 43.2557, lng: -79.8711 });

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Get user's requests
  const myRequests = requests.filter(r => 
    r.survivorId === currentUser.id
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
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hover:bg-blue-700 p-2 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">User Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/missions')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
          >
            <Heart className="w-4 h-4" />
            Volunteer
          </button>
        </div>
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
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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

export default UserDashboard;

