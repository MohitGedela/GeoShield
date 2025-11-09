import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Geo<span className="text-blue-600">Shield</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time disaster response coordination platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-16">
          <button
            onClick={() => navigate('/login')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">
              Sign in to your account
            </p>
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <UserPlus className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-600">
              Create a new account
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

