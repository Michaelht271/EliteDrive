import React from 'react';
import { Badge } from 'react-bootstrap';

const BaseBadge = ({ children, variant = 'primary', className = '', ...props }) => {
  // Map custom design system colors to bootstrap variants if needed
  return (
    <Badge 
      bg={variant} 
      className={`px-3 py-1 rounded-pill label-sm fw-bold ${className}`} 
      {...props}
    >
      {children}
    </Badge>
  );
};

export default BaseBadge;
