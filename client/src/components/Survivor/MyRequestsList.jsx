import React from 'react';
import { Clock, CheckCircle, User } from 'lucide-react';

const MyRequestsList = ({ requests }) => {
  const activeRequests = requests.filter(r => r.status !== 'Fulfilled');
  const fulfilledRequests = requests.filter(r => r.status === 'Fulfilled');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'Fulfilled':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4">My Requests</h2>
      
      {activeRequests.length === 0 && fulfilledRequests.length === 0 ? (
        <p className="text-gray-500 text-sm">No requests yet</p>
      ) : (
        <div className="space-y-3">
          {activeRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">{request.type}</span>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{request.description || 'No description'}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(request.createdAt).toLocaleTimeString()}
                </span>
                {request.assignedVolunteerName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {request.assignedVolunteerName}
                  </span>
                )}
              </div>
            </div>
          ))}

          {fulfilledRequests.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Completed</h3>
              {fulfilledRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-3 opacity-75">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{request.type}</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRequestsList;

