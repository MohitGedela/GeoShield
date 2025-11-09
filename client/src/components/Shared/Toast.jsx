import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-orange-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${colors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;

