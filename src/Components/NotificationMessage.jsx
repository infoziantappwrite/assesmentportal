// components/NotificationMessage.jsx
import React, { useEffect } from 'react';

const variants = {
  success: 'bg-green-100 text-green-700 border-green-500',
  error: 'bg-red-100 text-red-700 border-red-500',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-500',
};

const NotificationMessage = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`px-4 py-2 border rounded-lg shadow-md text-sm ${variants[type]}`}>
        {message}
      </div>
    </div>
  );
};

export default NotificationMessage;
