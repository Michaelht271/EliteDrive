import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const BaseButton = ({ 
  children, 
  variant = 'primary', 
  isCTA = false, 
  isLoading = false, 
  ...props 
}) => {
  const customClass = isCTA ? 'btn-cta' : '';
  
  return (
    <Button 
      variant={variant} 
      className={`${customClass} d-flex align-items-center justify-content-center gap-2 label-md transition-all ${props.className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner size="sm" animation="border" /> : children}
    </Button>
  );
};

export default BaseButton;
