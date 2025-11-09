import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Users, Forward } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AlertSystem = ({ requests }) => {
  const { currentUser, getAllUsers, sendMessage, forwardAlert } = useApp();
  const [message, setMessage] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('volunteer'); // 'volunteer' or 'survivor'
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState({ volunteers: [], survivors: [] });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [forwardMessage, setForwardMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const criticalIssues = requests.filter(r => 
    r.urgency === 'Urgent' && r.status === 'Pending'
  );

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUserId) {
      alert('Please enter a message and select a user');
      return;
    }

    try {
      await sendMessage({
        fromCoordinatorId: currentUser.id,
        toUserId: selectedUserId,
        toUserType: selectedUserType,
        message: message.trim()
      });
      setMessage('');
      setSelectedUserId('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleForwardAlert = async () => {
    if (!selectedRequest || !selectedUserId) {
      alert('Please select a request and a volunteer');
      return;
    }

    try {
      await forwardAlert(
        selectedRequest.id,
        [selectedUserId],
        forwardMessage.trim() || `Urgent request: ${selectedRequest.type} - ${selectedRequest.description}`
      );
      setSelectedRequest(null);
      setSelectedUserId('');
      setForwardMessage('');
      alert('Alert forwarded successfully!');
    } catch (error) {
      console.error('Error forwarding alert:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
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

      {/* Send Message Section */}
      <div className="space-y-2 border-b pb-4">
        <label className="block text-sm font-medium text-gray-700">
          Send Message to User
        </label>
        
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => {
              setSelectedUserType('volunteer');
              setSelectedUserId('');
            }}
            className={`flex-1 py-1 px-2 rounded text-sm ${
              selectedUserType === 'volunteer'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Volunteer
          </button>
          <button
            onClick={() => {
              setSelectedUserType('survivor');
              setSelectedUserId('');
            }}
            className={`flex-1 py-1 px-2 rounded text-sm ${
              selectedUserType === 'survivor'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Survivor
          </button>
        </div>

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select {selectedUserType}...</option>
          {(selectedUserType === 'volunteer' ? users.volunteers : users.survivors).map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.phone})
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          rows="2"
        />
        <button
          onClick={handleSendMessage}
          className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </div>

      {/* Forward Alert Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Forward className="w-4 h-4" />
          Forward Request to Volunteer
        </label>
        
        <select
          value={selectedRequest?.id || ''}
          onChange={(e) => {
            const req = requests.find(r => r.id === e.target.value);
            setSelectedRequest(req);
            setSelectedUserId('');
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select a request...</option>
          {requests.filter(r => r.status === 'Pending').map(req => (
            <option key={req.id} value={req.id}>
              {req.type} - {req.urgency} - {req.survivorName || 'Unknown'}
            </option>
          ))}
        </select>

        {selectedRequest && (
          <>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select volunteer...</option>
              {users.volunteers.map(vol => (
                <option key={vol.id} value={vol.id}>
                  {vol.name} ({vol.phone})
                </option>
              ))}
            </select>

            <textarea
              value={forwardMessage}
              onChange={(e) => setForwardMessage(e.target.value)}
              placeholder="Optional custom message..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows="2"
            />
            <button
              onClick={handleForwardAlert}
              className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <Forward className="w-4 h-4" />
              Forward Alert
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertSystem;

