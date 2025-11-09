import React from 'react';
import { AlertCircle, Users, CheckCircle, Clock } from 'lucide-react';

const StatsOverview = ({ requests, volunteers, safeZones }) => {
  const activeRequests = requests.filter(r => r.status !== 'Fulfilled');
  const urgentRequests = activeRequests.filter(r => r.urgency === 'Urgent');
  const highRequests = activeRequests.filter(r => r.urgency === 'High');
  const fulfilledToday = requests.filter(r => {
    if (r.status !== 'Fulfilled' || !r.completedAt) return false;
    const today = new Date();
    const completed = new Date(r.completedAt);
    return completed.toDateString() === today.toDateString();
  }).length;

  const activeVolunteers = volunteers.filter(v => v.status === 'Active').length;

  // Calculate average response time (for assigned requests)
  const assignedRequests = requests.filter(r => r.status === 'Assigned' && r.createdAt && r.assignedVolunteerId);
  const avgResponseTime = assignedRequests.length > 0
    ? Math.round(
        assignedRequests.reduce((sum, r) => {
          const responseTime = Date.now() - new Date(r.createdAt).getTime();
          return sum + responseTime;
        }, 0) / assignedRequests.length / 60000
      )
    : 0;

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview Statistics</h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={AlertCircle}
          title="Active Requests"
          value={activeRequests.length}
          color="red"
        />
        <StatCard
          icon={Users}
          title="Active Volunteers"
          value={activeVolunteers}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Fulfilled Today"
          value={fulfilledToday}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Avg Response (min)"
          value={avgResponseTime}
          color="orange"
        />
      </div>

      {/* Request Breakdown */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-3">Request Breakdown by Urgency</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-red-600 font-semibold">Urgent</span>
            <span className="text-lg font-bold">{urgentRequests.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-600 font-semibold">High</span>
            <span className="text-lg font-bold">{highRequests.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-yellow-600 font-semibold">Medium</span>
            <span className="text-lg font-bold">
              {activeRequests.filter(r => r.urgency === 'Medium').length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 font-semibold">Low</span>
            <span className="text-lg font-bold">
              {activeRequests.filter(r => r.urgency === 'Low').length}
            </span>
          </div>
        </div>
      </div>

      {/* Safe Zones Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-3">Safe Zones Status</h3>
        <div className="space-y-2">
          {safeZones.slice(0, 5).map(zone => (
            <div key={zone.id} className="flex justify-between items-center text-sm">
              <span className="font-medium">{zone.name}</span>
              <span className="text-gray-600">
                {zone.occupancy}/{zone.capacity} ({Math.round((zone.occupancy / zone.capacity) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;

