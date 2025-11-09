import React from 'react';
import { Trophy, Target } from 'lucide-react';

const VolunteerStats = ({ volunteer }) => {
  if (!volunteer) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-blue-700 px-3 py-2 rounded-lg">
        <Trophy className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {volunteer.completedMissions || 0} Completed
        </span>
      </div>
      {volunteer.activeMissions?.length > 0 && (
        <div className="flex items-center gap-2 bg-blue-700 px-3 py-2 rounded-lg">
          <Target className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {volunteer.activeMissions.length} Active
          </span>
        </div>
      )}
    </div>
  );
};

export default VolunteerStats;

