import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const baseStyles = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-500 focus:ring-green-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
    outline: "bg-transparent border border-green-600 text-green-600 hover:text-white hover:bg-green-600 focus:ring-green-500",
    link: "bg-transparent text-green-600 hover:text-green-500 underline p-0"
  };
  
  const sizes = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg"
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Don't apply padding to link variant
  const sizeClass = variant === 'link' ? '' : sizes[size];
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizeClass} ${widthClass} ${disabledClass} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 