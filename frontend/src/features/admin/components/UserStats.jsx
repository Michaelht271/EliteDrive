import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const UserStats = ({ users }) => {
  const stats = [
    { label: 'Tổng số', value: users.length, sub: 'người dùng', color: '#001e40' },
    { label: 'Hoạt động', value: users.filter(u => u.enabled).length, sub: 'tài khoản', color: '#10b981' },
    { label: 'Tạm khóa', value: users.filter(u => !u.enabled).length, sub: 'tài khoản', color: '#ef4444' },
    { label: 'Nhân viên', value: users.filter(u => u.userType === 'STAFF').length, sub: 'đang làm việc', color: '#3b82f6' }
  ];

  return (
    <Row className="g-4 mb-5">
      {stats.map((stat, i) => (
        <Col md={3} key={i}>
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-bottom border-4" style={{ borderBottomColor: stat.color + ' !important' }}>
            <span className="text-muted text-uppercase fw-black" style={{ fontSize: '9px', letterSpacing: '1.2px' }}>{stat.label}</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h2 className="fw-black mb-0" style={{ color: stat.color }}>{stat.value}</h2>
              <span className="text-muted small fw-medium">{stat.sub}</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UserStats;
