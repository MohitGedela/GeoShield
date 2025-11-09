import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CheckInButton = () => {
  const { checkIn, currentUser } = useApp();
  const [status, setStatus] = useState(null);

  const handleCheckIn = async (isSafe) => {
    try {
      await checkIn({
        userId: currentUser?.id || `surv${Date.now()}`,
        userName: currentUser?.name || 'Anonymous',
        status: isSafe ? 'Safe' : 'Unsafe',
        timestamp: new Date().toISOString()
      });
      setStatus(isSafe ? 'safe' : 'unsafe');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleCheckIn(true)}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          status === 'safe'
            ? 'bg-green-600 text-white'
            : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
        }`}
      >
        <CheckCircle className="w-4 h-4 inline mr-2" />
        Check In Safe
      </button>
      <button
        onClick={() => handleCheckIn(false)}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          status === 'unsafe'
            ? 'bg-red-600 text-white'
            : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
        }`}
      >
        <XCircle className="w-4 h-4 inline mr-2" />
        Need Help
      </button>
    </div>
  );
};

export default CheckInButton;

