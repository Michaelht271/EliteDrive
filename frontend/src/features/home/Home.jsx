import React from 'react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import Hero from '../../components/home/Hero.jsx';
import FleetCategories from '../../components/home/FleetCategories.jsx';
import FeaturedFleet from '../../components/home/FeaturedFleet.jsx';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <FleetCategories />
        <FeaturedFleet />
        
        {/* Testimonials Section */}
        <section className="py-5 bg-white">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Được Tin Tưởng Bởi Chuyên Gia</h2>
              <p className="text-muted body-md">Chất lượng dịch vụ xuất sắc được kiểm chứng bởi các khách hàng doanh nghiệp thường xuyên của chúng tôi</p>
            </div>
            <div className="row g-4">
              {[
                { name: 'Marcus Henderson', role: 'Phó Chủ tịch Doanh nghiệp', text: 'Mức độ dịch vụ tại EliteDrive là vô đối. Quy trình nhận xe diễn ra liền mạch và phương tiện luôn trong tình trạng như mới từ showroom.' },
                { name: 'Elena Rodriguez', role: 'Người sáng lập Tech', text: 'Tôi đặc biệt chỉ sử dụng đội xe điện của họ khi di chuyển trong thành phố. Sự hỗ trợ sạc điện mà họ cung cấp giúp trải nghiệm trở nên hoàn toàn thoải mái.' },
                { name: 'Tiến sĩ Julian Vance', role: 'Cố vấn Toàn cầu', text: 'Sự chú ý đến từng chi tiết thật ấn tượng. Từ quá trình đặt xe đến các tính năng của phương tiện, mọi thứ đều toát lên chất lượng và sự tin cậy.' }
              ].map((client, i) => (
                <div className="col-md-4" key={i}>
                  <div className="glass-card p-4 rounded-4 shadow-sm h-100 border transition-all">
                    <div className="text-warning mb-3 small">★★★★★</div>
                    <p className="text-muted body-md mb-4 lh-lg">"{client.text}"</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                        <span className="text-primary fw-bold small">{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-primary">{client.name}</h6>
                        <span className="text-muted label-sm" style={{ fontSize: '10px' }}>{client.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Home;
