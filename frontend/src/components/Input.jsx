import React from 'react';

const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  onKeyPress,
  placeholder,
  label,
  error,
  size = 'medium',
  fullWidth = true,
  className = '',
  ...rest
}) => {
  const sizes = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500';
  
  const inputClasses = `
    ${sizes[size]} 
    ${widthClass} 
    ${errorClass} 
    ${className}
    appearance-none 
    bg-white
    border 
    rounded-md 
    leading-tight 
    focus:outline-none 
    focus:ring-2 
    focus:border-transparent
    transition-colors
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={inputClasses}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 