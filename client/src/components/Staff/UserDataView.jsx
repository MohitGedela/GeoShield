import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UserDataView = ({ onBack }) => {
  const { getAllUsers } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const regularUsers = users.filter(u => u.role === 'user');
  const staffUsers = users.filter(u => u.role === 'staff');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-orange-600 text-white px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="hover:bg-orange-700 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          User Data
        </h1>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Regular Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Users ({regularUsers.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Phone</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Active Missions</th>
                      <th className="text-left py-2 px-4">Completed</th>
                      <th className="text-left py-2 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.phone}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{user.activeMissions?.length || 0}</td>
                        <td className="py-2 px-4">{user.completedMissions || 0}</td>
                        <td className="py-2 px-4 text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {regularUsers.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No users registered yet</p>
                )}
              </div>
            </div>

            {/* Staff Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Staff ({staffUsers.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Phone</th>
                      <th className="text-left py-2 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.phone}</td>
                        <td className="py-2 px-4 text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {staffUsers.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No staff members</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDataView;

