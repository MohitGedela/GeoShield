import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AlertSystem = ({ requests }) => {
  const { currentUser, getAllUsers, sendAlert } = useApp();
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('all'); // 'all' or specific user ID
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter(u => u.role === 'user')); // Only regular users
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const criticalIssues = requests.filter(r => 
    r.urgency === 'Urgent' && r.status === 'Pending'
  );

  const handleSendAlert = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      await sendAlert(
        currentUser.id,
        selectedUserId === 'all' ? 'all' : selectedUserId,
        message.trim()
      );
      setMessage('');
      setSelectedUserId('all');
    } catch (error) {
      console.error('Error sending alert:', error);
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

      {/* Send Alert Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Send Alert
        </label>
        
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.phone})
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter alert message..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          rows="3"
        />
        <button
          onClick={handleSendAlert}
          className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Alert {selectedUserId === 'all' ? 'to All Users' : ''}
        </button>
      </div>
    </div>
  );
};

export default AlertSystem;

