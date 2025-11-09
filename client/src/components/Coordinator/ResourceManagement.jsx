import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

const ResourceManagement = ({ safeZones }) => {
  const { loadData } = useApp();
  const [editingZone, setEditingZone] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (zone) => {
    setEditingZone(zone.id);
    setEditData({
      occupancy: zone.occupancy,
      capacity: zone.capacity,
      supplies: { ...zone.supplies }
    });
  };

  const handleSave = async (zoneId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await axios.put(`${API_URL}/api/safe-zones/${zoneId}`, editData);
      setEditingZone(null);
      loadData();
    } catch (error) {
      console.error('Error updating safe zone:', error);
      alert('Failed to update safe zone');
    }
  };

  const handleCancel = () => {
    setEditingZone(null);
    setEditData({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-4">Resource Inventory</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {safeZones.map(zone => (
          <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">{zone.name}</h4>
                <p className="text-sm text-gray-600">{zone.type}</p>
              </div>
              {editingZone === zone.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(zone.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(zone)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity</span>
                  {editingZone === zone.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editData.occupancy}
                        onChange={(e) => setEditData({ ...editData, occupancy: parseInt(e.target.value) })}
                        className="w-16 border rounded px-2"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        value={editData.capacity}
                        onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
                        className="w-16 border rounded px-2"
                      />
                    </div>
                  ) : (
                    <span>{zone.occupancy}/{zone.capacity}</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(zone.occupancy / zone.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                {['food', 'water', 'medical', 'blankets'].map(supply => (
                  <div key={supply}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize">{supply}</span>
                      {editingZone === zone.id ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editData.supplies[supply]}
                          onChange={(e) => setEditData({
                            ...editData,
                            supplies: {
                              ...editData.supplies,
                              [supply]: parseInt(e.target.value)
                            }
                          })}
                          className="w-16 border rounded px-1 text-xs"
                        />
                      ) : (
                        <span>{zone.supplies[supply]}%</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          zone.supplies[supply] > 50 ? 'bg-green-600' :
                          zone.supplies[supply] > 25 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${zone.supplies[supply]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceManagement;

