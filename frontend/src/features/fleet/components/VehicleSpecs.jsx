import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Users, Settings, Fuel, Gauge, Zap, Star } from 'lucide-react';

const VehicleSpecs = ({ vehicle }) => {
  const specs = [
    { icon: Users, label: 'Sức chứa', value: `${vehicle.seats} chỗ`, color: '#3b82f6' },
    { icon: Settings, label: 'Hộp số', value: vehicle.transmission === 'AUTOMATIC' ? 'Tự động' : 'Số sàn', color: '#10b981' },
    { icon: Fuel, label: 'Nhiên liệu', value: vehicle.fuelType === 'GASOLINE' ? 'Xăng' : 'Dầu', color: '#f59e0b' },
    { icon: Gauge, label: '0-100 km/h', value: '3.5 giây', color: '#ef4444' },
    { icon: Zap, label: 'Biển số', value: vehicle.licensePlate, color: '#8b5cf6' },
    { icon: Star, label: 'Màu sắc', value: vehicle.color, color: '#ec4899' }
  ];

  return (
    <div className="mb-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <h3 className="h4 m-0" style={{ color: '#0f172a', fontWeight: 900 }}>Thông số kỹ thuật</h3>
      </div>
      <Row className="g-3">
        {specs.map((item, idx) => (
          <Col md={4} key={idx}>
            <div 
              className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 d-flex flex-column gap-3 border" 
              style={{ borderColor: '#f1f5f9', transition: 'all 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="p-2 rounded-3 d-inline-block" style={{ backgroundColor: `${item.color}15`, width: 'fit-content' }}>
                <item.icon size={26} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '1.2px' }}>{item.label}</div>
                <div style={{ fontSize: '22px', color: '#0f172a', lineHeight: '1.2', fontWeight: 900 }}>{item.value}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VehicleSpecs;
