import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Map/MapComponent';
import StatsOverview from '../Coordinator/StatsOverview';
import ResourceManagement from '../Coordinator/ResourceManagement';
import AlertSystem from '../Coordinator/AlertSystem';
import { ArrowLeft, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import UserDataView from './UserDataView';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { requests, safeZones, volunteers, currentUser } = useApp();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showUserData, setShowUserData] = useState(false);

  // Redirect if not logged in or not staff
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (currentUser.role !== 'staff') {
    navigate('/user');
    return null;
  }

  // Get current (pending/assigned) and completed requests
  const currentRequests = requests.filter(r => r.status !== 'Fulfilled');
  const completedRequests = requests.filter(r => r.status === 'Fulfilled');

  if (showUserData) {
    return <UserDataView onBack={() => setShowUserData(false)} />;
  }

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
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowUserData(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800"
          >
            <Users className="w-4 h-4" />
            View Users
          </button>
          <button
            onClick={() => setShowResources(!showResources)}
            className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800"
          >
            {showResources ? 'Hide' : 'Show'} Resources
          </button>
        </div>
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

          {/* Current Requests */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-4">Current Help Requests ({currentRequests.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">No active requests</p>
              ) : (
                currentRequests.map(req => (
                  <div key={req.id} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{req.type}</p>
                        <p className="text-xs text-gray-600">{req.survivorName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{req.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        req.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                        req.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Requests */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-4">Completed Requests ({completedRequests.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {completedRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">No completed requests</p>
              ) : (
                completedRequests.map(req => (
                  <div key={req.id} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{req.type}</p>
                        <p className="text-xs text-gray-600">{req.survivorName || 'Unknown'}</p>
                        {req.completedAt && (
                          <p className="text-xs text-gray-500">
                            Completed: {new Date(req.completedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <AlertSystem requests={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

