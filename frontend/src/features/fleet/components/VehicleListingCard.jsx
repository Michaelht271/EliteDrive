import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Settings, Users, Fuel, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VehicleListingCard = ({ vehicle }) => {
  const {
    carId,
    carName,
    brand,
    model,
    year,
    seats,
    transmission,
    fuelType,
    pricePerDay,
    thumbnailUrl,
    carStatus
  } = vehicle;
  
  const isAvailable = carStatus === 'AVAILABLE';

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=800';
    return url;
  };

  return (
    <Card className={`h-100 border-0 shadow-sm transition-all vehicle-card ${!isAvailable ? 'opacity-75' : ''}`} 
          style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {/* Image Section */}
      <div className="position-relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img 
          src={getImageUrl(thumbnailUrl)} 
          alt={carName} 
          className="w-100 h-100 object-fit-cover transition-all card-img-zoom" 
        />
        
        {/* Floating Status */}
        <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 2 }}>
          {isAvailable ? (
            <div className="bg-white px-3 py-1.5 rounded-pill shadow-sm d-flex align-items-center gap-2 border border-light">
              <span className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
              <span className="fw-black text-uppercase" style={{ fontSize: '11px', color: 'var(--primary)', letterSpacing: '0.5px' }}>Sẵn sàng</span>
            </div>
          ) : (
            <div className="bg-dark px-3 py-1.5 rounded-pill text-white shadow-sm">
              <span className="fw-black text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Đã đặt</span>
            </div>
          )}
        </div>

        <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 2 }}>
          <span className="badge bg-white text-primary shadow-sm fw-black" style={{ fontSize: '10px', padding: '5px 10px' }}>{brand.toUpperCase()}</span>
        </div>
      </div>

      <Card.Body className="p-4 d-flex flex-column">
        {/* Title & Model */}
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h3 className="h5 fw-black mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{carName}</h3>
            <span className="text-muted fw-bold" style={{ fontSize: '12px' }}>{year}</span>
          </div>
          <p className="text-muted body-sm mb-2">{model}</p>
          
          {/* Price Moved to Body */}
          <div className="d-flex align-items-baseline gap-1 mt-2">
            <span className="h4 fw-black text-primary mb-0">{pricePerDay.toLocaleString()}</span>
            <span className="text-muted fw-bold" style={{ fontSize: '12px' }}>VND / ngày</span>
          </div>
        </div>

        {/* Specs Row */}
        <div className="d-flex justify-content-between py-3 my-2 border-top border-bottom border-light">
          <div className="d-flex align-items-center gap-2">
            <Users size={16} className="text-primary opacity-70" />
            <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{seats} chỗ</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Settings size={16} className="text-primary opacity-70" />
            <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{transmission === 'AUTOMATIC' ? 'Tự động' : 'Số sàn'}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Fuel size={16} className="text-primary opacity-70" />
            <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{fuelType === 'GASOLINE' ? 'Xăng' : fuelType === 'DIESEL' ? 'Dầu' : 'Điện'}</span>
          </div>
        </div>

        {/* Footer: Button Only */}
        <div className="mt-auto pt-3 d-flex justify-content-end">
          <Button 
            as={Link}
            to={isAvailable ? `/cars/${carId}` : '#'}
            className={`rounded-pill px-4 py-2 border-0 fw-black shadow-sm transition-all ${isAvailable ? 'btn-primary' : 'btn-secondary disabled'}`}
            style={{ fontSize: '12px', letterSpacing: '0.5px' }}
          >
            {isAvailable ? 'XEM CHI TIẾT' : 'ĐÃ ĐẶT'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleListingCard;
