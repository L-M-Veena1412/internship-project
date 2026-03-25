import React from 'react';

/**
 * SafeImage Component - Reusable image component with fallback and lazy loading
 * Implements Direct URL approach with error handling
 */
const SafeImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/logo192.png",
  ...props 
}) => {
  const handleImageError = (e) => {
    e.target.src = fallbackSrc;
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
      {...props}
    />
  );
};

export default SafeImage;
