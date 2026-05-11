import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Settings, Users, Fuel, Heart } from 'lucide-react';
import { GetVehicles } from '../../core/use-cases/GetVehicles.js';

const FeaturedFleet = () => {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const response = await GetVehicles({}, { page: 0, size: 6, sort: 'createdDate,desc' });
        const mappedCars = response.content.map(car => ({
          id: car.carId,
          name: car.carName,
          brand: car.brand,
          price: car.pricePerDay,
          image: car.thumbnailUrl,
          type: car.transmission === 'AUTOMATIC' ? 'Tự động' : 'Số sàn',
          seats: car.seats,
          fuel: car.fuelType === 'GASOLINE' ? 'Xăng' : 'Dầu',
          rating: 4.9
        }));
        setFeaturedCars(mappedCars);
      } catch (error) {
        console.error('Failed to fetch featured cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=800';
    return url;
  };

  if (loading) return (
    <div className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-black mb-1" style={{ color: '#000000', fontSize: '2.5rem', letterSpacing: '-1.5px' }}>Đội xe nổi bật</h2>
            <p className="text-muted fw-medium fs-5 mb-0">Trải nghiệm những mẫu xe đẳng cấp nhất tại EliteDrive.</p>
          </div>
          <Button 
            variant="link" 
            className="text-primary fw-black text-decoration-none p-0 d-flex align-items-center gap-2"
            onClick={() => navigate('/cars')}
          >
            XEM TẤT CẢ <ArrowRight size={18} />
          </Button>
        </div>

        <Row className="g-4">
          {featuredCars.map((car) => (
            <Col lg={4} md={6} key={car.id}>
              <Card 
                className="h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover"
                onClick={() => navigate(`/cars/${car.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <Card.Img 
                    variant="top" 
                    src={getImageUrl(car.image)} 
                    className="w-100 h-100 object-fit-cover transition-all"
                  />
                  <div className="position-absolute top-0 end-0 p-3">
                    <Button variant="white" className="rounded-circle shadow-sm p-2 bg-white bg-opacity-90"><Heart size={18} className="text-danger" /></Button>
                  </div>
                  <div className="position-absolute bottom-0 start-0 p-3 w-100 bg-gradient-to-t from-black to-transparent opacity-60">
                    <Badge bg="warning" className="text-dark fw-black">THUÊ NHIỀU NHẤT</Badge>
                  </div>
                </div>
                
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h3 className="h5 fw-black mb-1" style={{ color: '#0f172a' }}>{car.name}</h3>
                      <p className="text-muted small fw-bold text-uppercase mb-0">{car.brand}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-warning fw-black">
                      <Star size={16} fill="currentColor" /> {car.rating}
                    </div>
                  </div>

                  <div className="d-flex gap-3 py-3 border-top border-bottom my-3">
                    <span className="d-flex align-items-center gap-1 text-muted small fw-bold"><Users size={14} /> {car.seats}</span>
                    <span className="d-flex align-items-center gap-1 text-muted small fw-bold"><Settings size={14} /> {car.type}</span>
                    <span className="d-flex align-items-center gap-1 text-muted small fw-bold"><Fuel size={14} /> {car.fuel}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h4 fw-black text-primary mb-0">{car.price?.toLocaleString()} <span style={{ fontSize: '12px' }}>VND/ngày</span></div>
                    <Button variant="dark" className="rounded-pill px-4 py-2 fw-black border-0" style={{ fontSize: '12px' }}>XEM CHI TIẾT</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedFleet;
