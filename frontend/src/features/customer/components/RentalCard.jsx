import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Calendar, MapPin, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const RentalCard = ({ rental, onCancel, onViewReceipt }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'PENDING': { label: 'Chờ xác nhận', bg: '#0ea5e9', color: '#fff', dot: '#fff' },
      'CONFIRMED': { label: 'Đã xác nhận', bg: '#22c55e', color: '#fff', dot: '#fff' },
      'RENTING': { label: 'Đang di chuyển', bg: '#f59e0b', color: '#fff', dot: '#fff' },
      'COMPLETED': { label: 'Hoàn thành', bg: '#10b981', color: '#fff', dot: '#fff' },
      'CANCELLED': { label: 'Đã hủy', bg: '#64748b', color: '#fff', dot: '#fff' }
    };
    return configs[status] || { label: status, bg: '#94a3b8', color: '#fff', dot: '#fff' };
  };

  const status = getStatusConfig(rental.status);
  
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=800';
    return url;
  };

  return (
    <div className="bg-white rounded-4 shadow-sm hover-shadow-lg transition-all overflow-hidden d-flex flex-column flex-md-row border border-light mb-4">
      {/* Media Section */}
      <div className="position-relative bg-light rental-card-image-wrapper">
        <img 
          src={getImageUrl(rental.thumbnailUrl)} 
          className="w-100 h-100 object-fit-cover" 
          alt={rental.carName} 
        />
      </div>

      {/* Content Section */}
      <div className="flex-grow-1 p-3 p-md-4 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>{rental.brand || 'Luxury Class'}</span>
            <h3 className="h5 fw-black mt-1 mb-0" style={{ color: '#0f172a' }}>{rental.carName || 'Thông tin xe đang cập nhật'}</h3>
          </div>
          
          <div 
            className="px-2 px-md-3 py-2 rounded-pill fw-black d-flex align-items-center gap-2 shadow-sm" 
            style={{ 
              backgroundColor: status.bg, 
              color: status.color, 
              fontSize: '10px',
              letterSpacing: '1px'
            }}
          >
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: status.dot,
              boxShadow: '0 0 0 2px rgba(255,255,255,0.3)'
            }}></span>
            {status.label.toUpperCase()}
          </div>
        </div>

        <Row className="g-0 py-3 border-top border-bottom border-light mb-3">
          <Col xs={6} md={3} className="border-end px-2 px-md-3">
            <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Ngày nhận</div>
            <div className="fw-bold small text-dark" style={{ fontSize: '11px' }}>{new Date(rental.startDate).toLocaleDateString('vi-VN')}</div>
          </Col>
          <Col xs={6} md={3} className="border-md-end px-2 px-md-3">
            <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Ngày trả</div>
            <div className="fw-bold small text-dark" style={{ fontSize: '11px' }}>{new Date(rental.endDate).toLocaleDateString('vi-VN')}</div>
          </Col>
          <Col xs={6} md={3} className="mt-3 mt-md-0 border-end px-2 px-md-3">
            <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Địa điểm</div>
            <div className="fw-bold small text-dark truncate" style={{ fontSize: '11px' }}>Hà Nội, VN</div>
          </Col>
          <Col xs={6} md={3} className="mt-3 mt-md-0 px-2 px-md-3">
            <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Sức chứa</div>
            <div className="fw-bold small text-dark" style={{ fontSize: '11px' }}>{rental.seats || '5'} Chỗ</div>
          </Col>
        </Row>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <div className="d-flex align-items-baseline gap-2">
            <h4 className="fw-black mb-0" style={{ color: '#0f172a' }}>{rental.totalPrice?.toLocaleString()}</h4>
            <span className="text-muted small fw-bold">VND Tổng cộng</span>
          </div>
          <div className="d-flex gap-2 w-100 w-sm-auto">
            {rental.status === 'PENDING' && (
              <Button 
                variant="outline-danger" 
                className="flex-grow-1 flex-sm-grow-0 rounded-3 px-3 py-2 fw-bold small border-2"
                onClick={() => onCancel(rental)}
              >
                Hủy đơn
              </Button>
            )}
            <Button 
              variant="outline-dark" 
              className="flex-grow-1 flex-sm-grow-0 rounded-3 px-3 py-2 fw-bold small border-2"
              onClick={() => onViewReceipt(rental)}
            >
              Chi tiết
            </Button>
            {(rental.status === 'COMPLETED' || rental.status === 'CANCELLED') && (
              <Button 
                variant="primary" 
                as={Link} 
                to={`/cars/${rental.carId}`} 
                className="flex-grow-1 flex-sm-grow-0 rounded-3 px-3 py-2 fw-bold small bg-primary border-0 shadow-sm"
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
