import React from 'react';
import { Badge } from 'react-bootstrap';
import { ShieldCheck, Ban, Clock } from 'lucide-react';

export const CarStatusBadge = ({ status }) => {
  const config = {
    'AVAILABLE': { label: 'SẴN SÀNG', variant: 'success', icon: ShieldCheck },
    'MAINTENANCE': { label: 'BẢO TRÌ', variant: 'warning', icon: Clock },
    'UNAVAILABLE': { label: 'HẾT XE', variant: 'danger', icon: Ban },
  };
  
  const { label, variant, icon: Icon } = config[status] || { label: status, variant: 'secondary', icon: Clock };
  
  return (
    <Badge bg={variant} className={`px-2 py-1 rounded-pill fw-bold bg-opacity-10 text-${variant}`} style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
      <Icon size={10} className="me-1" /> {label}
    </Badge>
  );
};

export const FuelBadge = ({ type }) => (
  <Badge bg="light" className="text-dark border px-2 py-1 rounded-pill fw-bold" style={{ fontSize: '9px' }}>
    {type === 'GASOLINE' ? 'XĂNG' : type === 'DIESEL' ? 'DẦU' : 'ĐIỆN'}
  </Badge>
);
