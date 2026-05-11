import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { Heart, Share2, Star, ChevronRight } from 'lucide-react';

// Components
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import VehicleHeader from './components/VehicleHeader.jsx';
import VehicleMedia from './components/VehicleMedia.jsx';
import VehicleSpecs from './components/VehicleSpecs.jsx';
import VehicleSummarySidebar from './components/VehicleSummarySidebar.jsx';
import RecommendationSection from './components/RecommendationSection.jsx';

// Custom Hook
import { useVehicleDetail } from './hooks/useVehicleDetail.js';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Nổi bật: Logic fetch dữ liệu đã được tách hoàn toàn ra Hook
  const { vehicle, recommendations, loading, error } = useVehicleDetail(id);

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
      <PublicFooter />
    </div>
  );

  if (error || !vehicle) return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center">
        <Alert variant="danger" className="border-0 shadow-sm rounded-4 px-5 py-3">
          <h4 className="fw-bold mb-2">Lỗi tải dữ liệu</h4>
          <p className="mb-3">{error || 'Không tìm thấy thông tin xe yêu cầu.'}</p>
          <Button variant="dark" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/cars')}>Quay lại đội xe</Button>
        </Alert>
      </div>
      <PublicFooter />
    </div>
  );

  const isAvailable = vehicle.carStatus === 'AVAILABLE';

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif', color: '#1e293b' }}>
      <Header />
      
      <main className="flex-grow-1 py-5">
        <Container style={{ maxWidth: '1200px' }}>
          
          <div className="d-flex justify-content-between align-items-start mb-2">
            <VehicleHeader 
              vehicle={vehicle} 
              onBack={() => navigate('/cars')} 
              isAvailable={isAvailable} 
            />
            <div className="d-flex gap-2 mt-4 pt-2">
              <Button variant="white" className="bg-white rounded-circle border shadow-sm p-3 transition-all hover-scale-110"><Heart size={22} className="text-danger" /></Button>
              <Button variant="white" className="bg-white rounded-circle border shadow-sm p-3 transition-all hover-scale-110"><Share2 size={22} className="text-dark" /></Button>
            </div>
          </div>

          <Row className="g-4 g-lg-5">
            <Col lg={8}>
              <VehicleMedia thumbnailUrl={vehicle.thumbnailUrl} carName={vehicle.carName} />
              <VehicleSpecs vehicle={vehicle} />

              {/* Description Block */}
              <div className="bg-white p-4 p-md-5 shadow-sm mb-5 border-0" style={{ borderRadius: '32px' }}>
                <h3 className="h4 mb-4" style={{ color: '#0f172a', fontWeight: 900 }}>Trải nghiệm xe</h3>
                <p className="text-muted lh-lg mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  {vehicle.description || `Trải nghiệm sự đỉnh cao của kỹ thuật ô tô với dòng ${vehicle.brand} ${vehicle.carName}. Mẫu xe đời ${vehicle.year} này kết hợp hoàn hảo giữa hiệu năng, sự sang trọng và công nghệ tiên tiến để mang lại trải nghiệm lái xe khó quên.`}
                </p>
              </div>

              {/* Quick Reviews Block */}
              <div className="bg-white p-4 p-md-5 shadow-sm border-0" style={{ borderRadius: '32px' }}>
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <h3 className="h4 mb-0" style={{ color: '#0f172a', fontWeight: 900 }}>Khách hàng nói gì?</h3>
                  <div className="bg-light px-3 py-1 rounded-pill small" style={{ fontWeight: 900 }}>4.9/5.0</div>
                </div>
                <div className="border-bottom pb-4 mb-4">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-dark rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '13px' }}>MN</div>
                      <div>
                        <h6 className="mb-0 fw-bold">Minh Nguyen</h6>
                        <span className="text-muted small">2 ngày trước</span>
                      </div>
                    </div>
                    <div className="d-flex gap-1 text-warning">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-muted small mb-0">Một trải nghiệm thực sự đẳng cấp. Xe mới, sạch và cảm giác lái rất phấn khích.</p>
                </div>
                <Button variant="link" className="text-dark fw-bold text-decoration-none p-0">XEM TẤT CẢ ĐÁNH GIÁ <ChevronRight size={16} /></Button>
              </div>
            </Col>

            <Col lg={4}>
              <VehicleSummarySidebar 
                vehicle={vehicle} 
                isAvailable={isAvailable}
                onBookNow={() => navigate(`/booking/${vehicle.carId}`)}
              />
            </Col>
          </Row>

          <RecommendationSection 
            recommendations={recommendations} 
            onNavigateAll={() => navigate('/cars')} 
          />

        </Container>
      </main>
      <PublicFooter />
    </div>
  );
};

export default VehicleDetail;
