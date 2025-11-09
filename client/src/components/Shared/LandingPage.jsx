import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Heart, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setUserMode } = useApp();

  const handleModeSelect = (mode) => {
    setUserMode(mode);
    navigate(`/${mode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Geo<span className="text-red-600">Shield</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time disaster response coordination platform connecting survivors with volunteers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <button
            onClick={() => handleModeSelect('survivor')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I Need Help</h2>
            <p className="text-gray-600">
              Request assistance, check in as safe, and find nearby safe zones
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('volunteer')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I Want to Help</h2>
            <p className="text-gray-600">
              View requests, accept missions, and provide assistance to those in need
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('coordinator')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Shield className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coordinator View</h2>
            <p className="text-gray-600">
              Monitor response efforts, manage resources, and coordinate operations
            </p>
          </button>
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p>Emergency Response Platform | McMaster University</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

