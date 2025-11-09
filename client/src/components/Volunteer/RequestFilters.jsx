import React from 'react';
import { X } from 'lucide-react';

const RequestFilters = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency
          </label>
          <select
            value={filters.urgency}
            onChange={(e) => onFiltersChange({ ...filters, urgency: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Food/Water">Food/Water</option>
            <option value="Medical">Medical</option>
            <option value="Shelter">Shelter</option>
            <option value="Evacuation">Evacuation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RequestFilters;

