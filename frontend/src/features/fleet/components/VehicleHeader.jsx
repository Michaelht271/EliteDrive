import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft, Star, MapPin } from 'lucide-react';

const VehicleHeader = ({ vehicle, onBack, isAvailable }) => {
  return (
    <div className="mb-4">
      <nav className="d-flex align-items-center gap-2 text-muted text-uppercase fw-bold mb-4" style={{ fontSize: '10px', letterSpacing: '1px' }}>
        <span className="hover-text-primary transition-all cursor-pointer" onClick={onBack}>Đội xe</span>
        <span className="opacity-50">/</span>
        <span className="opacity-50">{vehicle.brand}</span>
        <span className="opacity-50">/</span>
        <span className="text-primary">{vehicle.carName}</span>
      </nav>

      <div className="d-flex align-items-center gap-4">
        <Button 
          variant="link" 
          onClick={onBack}
          className="btn-back-custom shadow-none"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="mb-0" style={{ fontSize: '3rem', color: '#0f172a', letterSpacing: '-1.5px', fontWeight: 900 }}>{vehicle.carName}</h1>
          <div className="d-flex align-items-center gap-4 mt-2">
            <div className="d-flex align-items-center gap-1 text-warning">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              <span className="ms-1 text-dark" style={{ fontWeight: 900, fontSize: '14px' }}>4.9</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted fw-bold" style={{ fontSize: '12px' }}>
              <MapPin size={14} /> <span>Hà Nội, Việt Nam</span>
            </div>
            <div className={`px-3 py-1 rounded-pill fw-black border ${isAvailable ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-danger bg-opacity-10 text-danger border-danger'}`} style={{ fontSize: '10px' }}>
              {isAvailable ? '● CÒN XE' : '● HẾT XE'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;
