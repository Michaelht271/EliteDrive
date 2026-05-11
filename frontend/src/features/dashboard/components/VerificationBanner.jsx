import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const VerificationBanner = () => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden text-white" 
          style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            position: 'relative'
          }}>
      {/* Nền trang trí - Icon Shield chìm */}
      <div className="position-absolute bottom-0 end-0 opacity-10" style={{ transform: 'translate(10%, 20%)', pointerEvents: 'none' }}>
        <ShieldCheck size={200} />
      </div>

      <Card.Body className="p-4 p-md-5 position-relative">
        <Row className="align-items-center g-4">
          <Col md={1} className="d-flex justify-content-center justify-content-md-start">
            <div className="bg-white bg-opacity-10 p-3 rounded-circle border border-white border-opacity-10 d-flex align-items-center justify-content-center shadow-sm">
              <ShieldCheck size={36} className="text-white" />
            </div>
          </Col>
          
          <Col md={7} lg={8} className="text-center text-md-start">
            <h4 className="fw-bold mb-2 tracking-tight">Xác minh danh tính Premium</h4>
            <p className="mb-0 text-white text-opacity-75 body-md" style={{ maxWidth: '500px' }}>
              Hoàn tất xác minh để mở khóa các dòng xe hạng sang và giảm tới 50% tiền đặt cọc bảo hiểm ngay hôm nay.
            </p>
          </Col>
          
          <Col md={4} lg={3} className="text-center text-md-end">
            <Button 
              className="btn-cta rounded-3 px-4 py-2 w-100 w-md-auto d-inline-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
              style={{ border: 'none' }}
            >
              Bắt đầu ngay
              <ArrowRight size={18} />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VerificationBanner;
