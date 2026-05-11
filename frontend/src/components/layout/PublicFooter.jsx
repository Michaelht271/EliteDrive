import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Send, CreditCard, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  // SVG Icons tối giản, sắc nét
  const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  return (
    <footer className="py-5" style={{ backgroundColor: '#000810', borderTop: '4px solid var(--secondary-container)' }}>
      <Container fluid="xl" className="py-4">
        <Row className="g-5">
          <Col lg={4} md={12}>
            <div className="mb-4">
              <h4 className="fw-bold text-white tracking-tight mb-1" style={{ fontSize: '26px' }}>EliteDrive</h4>
              <span className="text-warning label-sm fw-bold" style={{ fontSize: '10px', letterSpacing: '2px', opacity: 0.9 }}>ELITEDRIVE</span>
            </div>
            <p className="text-white opacity-75 body-md lh-lg mb-4" style={{ maxWidth: '350px' }}>
              Thiết lập tiêu chuẩn vàng trong dịch vụ thuê xe cao cấp cho các chuyên gia và du khách thế giới. Tin cậy tuyệt đối trên mọi dặm hành trình.
            </p>
            <div className="d-flex gap-3">
              <Link to="/" className="btn-icon bg-white bg-opacity-10 text-white hover-bg-primary transition-all border-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FacebookIcon />
              </Link>
              <Link to="/" className="btn-icon bg-white bg-opacity-10 text-white hover-bg-primary transition-all border-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <InstagramIcon />
              </Link>
            </div>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h6 className="fw-bold mb-4 text-white text-uppercase tracking-wider" style={{ fontSize: '14px', opacity: 0.9 }}>Đội xe</h6>
            <ul className="list-unstyled lh-lg">
              <li><Link to="/cars" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Tất cả xe</Link></li>
              <li><Link to="/cars" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Sedan hạng sang</Link></li>
              <li><Link to="/cars" className="text-decoration-none text-white opacity-70 hover-white transition-all small">SUV cao cấp</Link></li>
              <li><Link to="/cars" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Xe điện (EV)</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h6 className="fw-bold mb-4 text-white text-uppercase tracking-wider" style={{ fontSize: '14px', opacity: 0.9 }}>Dịch vụ</h6>
            <ul className="list-unstyled lh-lg">
              <li><Link to="/" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Tài khoản doanh nghiệp</Link></li>
              <li><Link to="/" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Dịch vụ tài xế</Link></li>
              <li><Link to="/" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Đưa đón sân bay</Link></li>
              <li><Link to="/" className="text-decoration-none text-white opacity-70 hover-white transition-all small">Thuê dài hạn</Link></li>
            </ul>
          </Col>
          
          <Col lg={4} md={4}>
            <h6 className="fw-bold mb-4 text-white text-uppercase tracking-wider" style={{ fontSize: '14px', opacity: 0.9 }}>Nhận tin tức</h6>
            <p className="text-white opacity-75 body-md mb-4 small">Đăng ký để nhận các ưu đãi độc quyền và cập nhật đội xe mới nhất.</p>
            <Form onSubmit={(e) => e.preventDefault()}>
              <div className="d-flex p-1 bg-dark bg-opacity-50 rounded-3 border border-white border-opacity-20 shadow-none">
                <Form.Control 
                  placeholder="Nhập địa chỉ email của bạn" 
                  className="bg-transparent border-0 py-2 text-white shadow-none small custom-placeholder"
                  style={{ color: '#ffffff' }}
                />
                <Button className="btn-cta rounded-2 px-3 border-0 py-2" type="button">
                  <Send size={16} strokeWidth={2.5} />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr className="my-5 border-white opacity-10" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white opacity-75 small">
          <p className="mb-0">© 2026 EliteDrive Concepts. Bảo lưu mọi quyền.</p>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex gap-2 align-items-center opacity-50">
              <CreditCard size={18} />
              <Wallet size={18} />
            </div>
            <div className="d-flex gap-3">
              <Link to="/" className="text-white text-decoration-none hover-white">Quyền riêng tư</Link>
              <Link to="/" className="text-white text-decoration-none hover-white">Điều khoản</Link>
            </div>
          </div>
        </div>
      </Container>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-placeholder::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .btn-cta:hover {
          background-color: #e67e00 !important;
          transform: scale(1.02);
        }
      `}} />
    </footer>
  );
};

export default PublicFooter;
