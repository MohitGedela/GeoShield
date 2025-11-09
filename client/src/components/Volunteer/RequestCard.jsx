import React from 'react';
import { MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RequestCard = ({ request, onSelect }) => {
  const { acceptRequest, currentUser } = useApp();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-600';
      case 'High':
        return 'bg-orange-600';
      case 'Medium':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  const handleAccept = () => {
    if (window.confirm('Accept this mission?')) {
      acceptRequest(request.id, currentUser.id, currentUser.name);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
      onClick={() => onSelect && onSelect()}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-sm">{request.type}</span>
        <span className={`text-xs px-2 py-1 rounded text-white ${getUrgencyColor(request.urgency)}`}>
          {request.urgency}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {request.description || 'No description provided'}
      </p>

      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          {request.peopleCount} {request.peopleCount === 1 ? 'person' : 'people'}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {Math.round((Date.now() - new Date(request.createdAt)) / 60000)} min ago
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAccept();
        }}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
      >
        Accept Mission
      </button>
    </div>
  );
};

export default RequestCard;

