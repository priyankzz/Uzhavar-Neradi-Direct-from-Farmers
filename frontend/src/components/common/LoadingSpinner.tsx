/**
 * Loading Spinner Component
 * Copy to: frontend/src/components/common/LoadingSpinner.tsx
 */

import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 'medium',
  text = 'Loading...'
}) => {
  
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center">
      <div className={`
        ${sizeClasses[size]} 
        border-gray-200 
        border-t-green-600 
        rounded-full 
        animate-spin
      `}></div>
      {text && <p className="mt-3 text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;