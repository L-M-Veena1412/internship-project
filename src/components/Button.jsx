import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-custom transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-olive-green text-white hover:bg-dark-green focus:ring-olive-green shadow-soft hover:shadow-medium',
    secondary: 'bg-light-brown text-white hover:bg-opacity-90 focus:ring-light-brown shadow-soft hover:shadow-medium',
    outline: 'border-2 border-olive-green text-olive-green hover:bg-olive-green hover:text-white focus:ring-olive-green',
    ghost: 'text-olive-green hover:bg-olive-green hover:bg-opacity-10 focus:ring-olive-green'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2.5 text-base',
    large: 'px-8 py-3 text-lg'
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
