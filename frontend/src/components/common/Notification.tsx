/**
 * Notification Component
 * Copy to: frontend/src/components/common/Notification.tsx
 */

import React, { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg animate-slide-in ${getStyles()}`}>
      <div className="flex items-center gap-3">
        {type === 'success' && <span className="text-xl">✅</span>}
        {type === 'error' && <span className="text-xl">❌</span>}
        {type === 'warning' && <span className="text-xl">⚠️</span>}
        {type === 'info' && <span className="text-xl">ℹ️</span>}
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 hover:opacity-75">×</button>
      </div>
    </div>
  );
};

export default Notification;