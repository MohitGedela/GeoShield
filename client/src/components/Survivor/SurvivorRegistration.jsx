import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const SurvivorRegistration = ({ onComplete }) => {
  const { registerSurvivor, sendVerificationCode, verifyCode } = useApp();
  const [step, setStep] = useState('phone'); // 'phone', 'verify', 'details'
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    lat: 43.2557,
    lng: -79.8711
  });

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const result = await sendVerificationCode(phone, 'survivor');
      setSentCode(result.code); // For demo - in production, don't show this
      setFormData({ ...formData, phone });
      setStep('verify');
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      await verifyCode(phone, verificationCode);
      setStep('details');
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const survivor = await registerSurvivor({ ...formData, verified: true });
      onComplete(survivor);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Survivor Registration</h2>
          <p className="text-gray-600 text-center mb-6">Enter your phone number to receive a verification code</p>
          
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="905-555-1234"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Send Verification Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Verify Phone Number</h2>
          <p className="text-gray-600 text-center mb-2">Enter the 6-digit code sent to {phone}</p>
          {sentCode && (
            <p className="text-sm text-red-600 text-center mb-4">Demo code: {sentCode}</p>
          )}
          
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code *
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Survivor Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurvivorRegistration;

