import React from 'react';

const Button = ({ variant = 'primary', children, className = '', ...props }) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    danger: 'btn-danger',
    success: 'btn-success',   // we may add this to utilities
  }[variant] || 'btn-primary';

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;