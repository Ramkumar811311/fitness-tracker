import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  headerClassName = '',
  bodyClassName = '', 
  footerContent = null 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 bg-gray-50 border-b ${headerClassName}`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className="px-6 py-3 bg-gray-50 border-t">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card; 