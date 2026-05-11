import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Car, ShieldCheck, PenTool, AlertCircle } from 'lucide-react';

const CarStats = ({ vehicles }) => {
  const stats = [
    { label: 'Tổng số xe', value: vehicles.length, color: '#001e40', icon: Car },
    { label: 'Sẵn sàng', value: vehicles.filter(v => v.carStatus === 'AVAILABLE').length, color: '#10b981', icon: ShieldCheck },
    { label: 'Đang bảo trì', value: vehicles.filter(v => v.carStatus === 'MAINTENANCE').length, color: '#f59e0b', icon: PenTool },
    { label: 'Bận/Hết xe', value: vehicles.filter(v => v.carStatus === 'UNAVAILABLE').length, color: '#ef4444', icon: AlertCircle }
  ];

  return (
    <Row className="g-4 mb-5">
      {stats.map((stat, i) => (
        <Col md={3} key={i}>
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted text-uppercase fw-black" style={{ fontSize: '9px', letterSpacing: '1.2px' }}>{stat.label}</span>
                <h2 className="fw-black mb-0 mt-1" style={{ color: stat.color }}>{stat.value}</h2>
              </div>
              <div className="p-2 rounded-3" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CarStats;
