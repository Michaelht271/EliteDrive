import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Calendar, Car, AlertCircle, TrendingUp } from 'lucide-react';

const RentalStats = () => {
  const stats = [
    { label: 'Tổng đơn thuê', val: '1,284', icon: <Calendar />, color: '#3b82f6' },
    { label: 'Đang di chuyển', val: '42', icon: <Car />, color: '#10b981' },
    { label: 'Chờ phê duyệt', val: '18', icon: <AlertCircle />, color: '#f59e0b' },
    { label: 'Doanh thu (Tháng)', val: '$84.2k', icon: <TrendingUp />, color: '#001e40' }
  ];

  return (
    <Row className="g-3 g-lg-4 mb-4 mb-lg-5">
      {stats.map((stat, i) => (
        <Col xs={12} sm={6} lg={3} key={i}>
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: `${stat.color}15`, color: stat.color }}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <div>
                <div className="text-muted fw-bold uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>{stat.label}</div>
                <h2 className="fw-black text-dark mb-0" style={{ fontSize: '24px' }}>{stat.val}</h2>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RentalStats;
