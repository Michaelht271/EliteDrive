import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FleetCategories = () => {
  const categories = [
    { 
      title: 'Sedan Hạng Sang', 
      desc: 'Sự sang trọng kết hợp với hiệu suất dành cho giới chuyên gia', 
      img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
      span: 6
    },
    { 
      title: 'Xe SUV', 
      desc: 'Rộng rãi & Mạnh mẽ', 
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      span: 3
    },
    { 
      title: 'Đội Xe Điện', 
      desc: 'Sự đổi mới thân thiện với môi trường', 
      img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800',
      span: 3
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Danh Mục Xe</h2>
          <p className="text-muted">Khám phá lựa chọn được tuyển chọn của chúng tôi cho mọi nhu cầu di chuyển</p>
        </div>
        <Row className="g-4">
          {categories.map((cat, idx) => (
            <Col xs={12} md={cat.span} key={idx}>
              <div className="category-card shadow-sm h-md-260">
                <img src={cat.img} alt={cat.title} />
                <div className="category-overlay">
                  <h3 className="h4 fw-bold mb-1">{cat.title}</h3>
                  <p className="small mb-0 opacity-75">{cat.desc}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FleetCategories;
