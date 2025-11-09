import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Map/MapComponent';
import VolunteerRegistration from './VolunteerRegistration';
import RequestCard from './RequestCard';
import ActiveMissionCard from './ActiveMissionCard';
import VolunteerStats from './VolunteerStats';
import RequestFilters from './RequestFilters';
import { ArrowLeft, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { requests, volunteers, currentUser, setCurrentUser } = useApp();
  const [showRegistration, setShowRegistration] = useState(!currentUser);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filters, setFilters] = useState({
    urgency: 'All',
    type: 'All',
    distance: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get pending requests
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  
  // Get active missions for current volunteer
  const activeMissions = currentUser
    ? requests.filter(r => 
        r.status === 'Assigned' && r.assignedVolunteerId === currentUser.id
      )
    : [];

  // Filter requests based on selected filters
  const filteredRequests = pendingRequests.filter(req => {
    if (filters.urgency !== 'All' && req.urgency !== filters.urgency) return false;
    if (filters.type !== 'All' && req.type !== filters.type) return false;
    return true;
  });

  if (showRegistration) {
    return (
      <VolunteerRegistration
        onComplete={(volunteer) => {
          setCurrentUser(volunteer);
          setShowRegistration(false);
        }}
      />
    );
  }

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
          <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <VolunteerStats volunteer={currentUser} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map Section - 70% */}
        <div className="flex-1 relative" style={{ width: '70%' }}>
          <MapComponent
            center={{ lat: 43.2557, lng: -79.8711 }}
            requests={filteredRequests}
            safeZones={[]}
            volunteers={volunteers}
            selectedMarker={selectedMarker}
            onMarkerClick={setSelectedMarker}
            showRequests={true}
            showSafeZones={false}
            showVolunteers={true}
          />
        </div>

        {/* Side Panel - 30% */}
        <div className="w-3/10 bg-gray-50 overflow-y-auto p-6">
          {showFilters && (
            <div className="mb-4">
              <RequestFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          {/* Active Mission */}
          {activeMissions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">Active Mission</h2>
              {activeMissions.map(mission => (
                <ActiveMissionCard key={mission.id} request={mission} />
              ))}
            </div>
          )}

          {/* Nearby Requests */}
          <div>
            <h2 className="text-lg font-bold mb-4">
              Available Requests ({filteredRequests.length})
            </h2>
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">No requests match your filters</p>
              ) : (
                filteredRequests
                  .sort((a, b) => {
                    const urgencyOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
                    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
                  })
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onSelect={() => setSelectedMarker(request)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

