import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { ChevronRight } from 'lucide-react';
import VehicleListingCard from './VehicleListingCard.jsx';

const RecommendationSection = ({ recommendations, onNavigateAll }) => {
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-5 pt-5 border-top" style={{ borderColor: '#f1f5f9' }}>
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h3 className="mb-1" style={{ fontSize: '2.2rem', color: '#0f172a', letterSpacing: '-1px', fontWeight: 900 }}>Có thể bạn quan tâm</h3>
          <p className="text-muted fw-medium">Lựa chọn hàng đầu khác dành cho bạn</p>
        </div>
        <Button variant="outline-dark" className="px-4 py-2 rounded-pill fw-bold" onClick={onNavigateAll}>Xem tất cả</Button>
      </div>
      <Row className="g-4">
        {recommendations.map(car => (
          <Col md={4} key={car.carId}>
            <VehicleListingCard vehicle={car} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default RecommendationSection;
