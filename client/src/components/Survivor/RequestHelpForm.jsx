import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RequestHelpForm = ({ onClose, mapCenter }) => {
  const { createRequest, currentUser } = useApp();
  const [formData, setFormData] = useState({
    type: 'Food/Water',
    urgency: 'Medium',
    peopleCount: 1,
    description: '',
    lat: mapCenter.lat,
    lng: mapCenter.lng
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({
        ...formData,
        survivorId: currentUser?.id || `surv${Date.now()}`,
        survivorName: currentUser?.name || 'Anonymous',
        survivorPhone: currentUser?.phone || 'N/A'
      });
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Request Help</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Help Needed
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="Food/Water">Food/Water</option>
              <option value="Medical">Medical</option>
              <option value="Shelter">Shelter</option>
              <option value="Evacuation">Evacuation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency Level
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of People Affected
            </label>
            <input
              type="number"
              min="1"
              value={formData.peopleCount}
              onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location (Lat, Lng)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                value={formData.lat.toFixed(6)}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                step="any"
                value={formData.lng.toFixed(6)}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Click on map to set location</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows="3"
              placeholder="Provide additional details..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestHelpForm;

