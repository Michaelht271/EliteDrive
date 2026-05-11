import React from 'react';
import { Badge } from 'react-bootstrap';
import { ShieldCheck, BadgeCheck, User } from 'lucide-react';

export const StatusBadge = ({ enabled }) => (
  <Badge bg={enabled ? 'success' : 'danger'} className={`px-2 py-1 rounded-pill fw-bold bg-opacity-10 text-${enabled ? 'success' : 'danger'}`} style={{ fontSize: '10px' }}>
    {enabled ? '● ĐANG HOẠT ĐỘNG' : '○ BỊ TẠM KHÓA'}
  </Badge>
);

export const RoleBadge = ({ type, simple = false }) => {
  const config = {
    'ADMIN': { icon: ShieldCheck, color: '#001e40', bg: 'rgba(0,30,64,0.1)' },
    'STAFF': { icon: BadgeCheck, color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
    'CUSTOMER': { icon: User, color: '#6c757d', bg: 'rgba(108,117,125,0.1)' }
  };
  const { icon: Icon, color, bg } = config[type] || config['CUSTOMER'];
  return (
    <div className={`d-inline-flex align-items-center gap-1.5 rounded-pill fw-black text-uppercase ${simple ? 'px-2 py-0.5' : 'px-3 py-1'}`} style={{ fontSize: simple ? '8px' : '9px', backgroundColor: bg, color: color }}>
      <Icon size={simple ? 10 : 12} /> {type}
    </div>
  );
};
