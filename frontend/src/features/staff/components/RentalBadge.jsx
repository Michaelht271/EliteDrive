import React from 'react';
import { Clock, CheckCircle, Car, CheckCircle2, XCircle } from 'lucide-react';

export const getStatusBadge = (status) => {
  const s = String(status || '').toUpperCase();
  const configs = {
    'PENDING': { bg: '#d5e3ff', text: 'Chờ duyệt', color: '#001b3c', icon: <Clock size={12} /> },
    'CONFIRMED': { bg: '#e6f4ea', text: 'Đã xác nhận', color: '#1e7e34', icon: <CheckCircle size={12} /> },
    'RENTING': { bg: '#fff4e5', text: 'Đang thuê', color: '#b7791f', icon: <Car size={12} /> },
    'COMPLETED': { bg: '#f1f3f5', text: 'Hoàn thành', color: '#495057', icon: <CheckCircle2 size={12} /> },
    'CANCELLED': { bg: '#fde8e8', text: 'Đã hủy', color: '#c81e1e', icon: <XCircle size={12} /> }
  };
  const config = configs[s] || { bg: '#eeeef0', text: s, color: '#43474f' };
  
  return (
    <div className="d-flex align-items-center gap-1 px-2 py-1 rounded-3 fw-bold" style={{ backgroundColor: config.bg, color: config.color, fontSize: '9px', letterSpacing: '0.5px' }}>
      {config.icon} {config.text.toUpperCase()}
    </div>
  );
};

const RentalBadge = ({ status }) => {
  return getStatusBadge(status);
};

export default RentalBadge;
