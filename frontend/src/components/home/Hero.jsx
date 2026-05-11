import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VehicleSearchForm from '../../features/fleet/components/VehicleSearchForm.jsx';

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = (data) => {
    const params = new URLSearchParams();
    if (data.location) params.append('keyword', data.location);
    if (data.pickupDate) params.append('pickup', data.pickupDate);
    if (data.returnDate) params.append('return', data.returnDate);
    
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="hero-gradient d-flex align-items-center position-relative py-5">
      <Container>
        <div className="text-center text-white mb-5">
          <h1 className="display-4 fw-bold mb-3">Thuê xe nhanh chóng, Lăn bánh tức thì</h1>
          <p className="body-lg mx-auto opacity-90" style={{ maxWidth: '700px' }}>
            Chỉ với vài cú click, sở hữu ngay chiếc xe ưng ý cho chuyến đi của bạn. Thủ tục đơn giản, minh bạch và nhận xe trong tích tắc.
          </p>
        </div>

        <VehicleSearchForm onSearch={handleSearch} />
      </Container>
    </section>
  );
};

export default Hero;
