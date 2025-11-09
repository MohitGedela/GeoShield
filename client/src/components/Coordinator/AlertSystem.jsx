import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';

const AlertSystem = ({ requests }) => {
  const [message, setMessage] = useState('');

  const criticalIssues = requests.filter(r => 
    r.urgency === 'Urgent' && r.status === 'Pending'
  );

  const handleBroadcast = () => {
    if (message.trim()) {
      // In a real app, this would send via Socket.io
      alert(`Broadcasting message to all volunteers: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        Alert System
      </h3>

      {criticalIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm font-semibold text-red-800 mb-1">
            {criticalIssues.length} Urgent Pending Request{criticalIssues.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-red-600">
            Immediate attention required
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Broadcast Message to Volunteers
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to broadcast..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          rows="3"
        />
        <button
          onClick={handleBroadcast}
          className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Broadcast
        </button>
      </div>
    </div>
  );
};

export default AlertSystem;

