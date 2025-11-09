import React from 'react';
import { Phone, MapPin, Navigation, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ActiveMissionCard = ({ request }) => {
  const { completeRequest, currentUser } = useApp();

  const handleComplete = () => {
    if (window.confirm('Mark this mission as complete?')) {
      completeRequest(request.id, currentUser.id);
    }
  };

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${request.lat},${request.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{request.type}</h3>
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Active
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Requester:</p>
          <p className="text-sm text-gray-600">{request.survivorName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">Phone:</p>
          <a
            href={`tel:${request.survivorPhone}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            {request.survivorPhone}
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">Description:</p>
          <p className="text-sm text-gray-600">{request.description || 'No description'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">People:</p>
          <p className="text-sm text-gray-600">{request.peopleCount} {request.peopleCount === 1 ? 'person' : 'people'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={openNavigation}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
        <button
          onClick={handleComplete}
          className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </button>
      </div>
    </div>
  );
};

export default ActiveMissionCard;

