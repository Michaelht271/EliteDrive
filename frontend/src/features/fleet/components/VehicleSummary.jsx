import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Settings, Users, Fuel } from 'lucide-react';

const VehicleSummary = ({ vehicle }) => {
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=1200';
    return url;
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <Card.Body className="p-4">
        <Row className="align-items-center g-4">
          <Col md={5}>
            <div className="rounded-3 overflow-hidden shadow-sm ratio ratio-16x9">
              <img src={getImageUrl(vehicle.thumbnailUrl)} alt={vehicle.carName} className="w-100 h-100 object-fit-cover" />
            </div>
          </Col>
          <Col md={7}>
            <span className="text-warning fw-black text-uppercase mb-1 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>Hạng xe cao cấp</span>
            <h2 className="h3 fw-black mb-3">{vehicle.carName}</h2>
            <div className="d-flex flex-wrap gap-3 mb-3 text-dark small fw-bold opacity-75">
              <span className="d-flex align-items-center gap-1"><Settings size={14} /> {vehicle.transmission === 'AUTOMATIC' ? 'Tự động' : 'Số sàn'}</span>
              <span className="d-flex align-items-center gap-1"><Users size={14} /> {vehicle.seats} chỗ</span>
              <span className="d-flex align-items-center gap-1"><Fuel size={14} /> {vehicle.fuelType}</span>
            </div>
            <div className="pt-3 border-top d-flex gap-2">
              <Badge bg="light" className="text-dark border-0 rounded-pill py-1 px-2 fw-bold" style={{ fontSize: '9px', backgroundColor: '#f1f5f9' }}>Bảo hiểm toàn diện</Badge>
              <Badge bg="light" className="text-dark border-0 rounded-pill py-1 px-2 fw-bold" style={{ fontSize: '9px', backgroundColor: '#f1f5f9' }}>Hỗ trợ 24/7</Badge>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VehicleSummary;
