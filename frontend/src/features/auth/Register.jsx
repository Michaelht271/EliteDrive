import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { User, Mail, Lock, Phone, MapPin, ShieldCheck, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseInput from '../../components/ui/BaseInput.jsx';
import BaseButton from '../../components/ui/BaseButton.jsx';
import BaseCheckbox from '../../components/ui/BaseCheckbox.jsx';
import { validateRegisterForm } from '../../utils/validation.js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    identifyId: '', // CCCD
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validate Form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setError('');
    setIsSubmitting(true);

    const result = await register(formData);
    if (result.success) {
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-surface overflow-x-hidden">
      <Header />
      
      <main className="flex-grow-1 d-flex align-items-stretch">
        <Container fluid className="p-0">
          <Row className="g-0 h-100">
            {/* Left Side: Brand Section */}
            <Col lg={6} className="d-none d-lg-block position-relative bg-primary overflow-hidden">
              <img 
                src="/car/car-register.png"
                alt="Đội xe cao cấp" 
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                style={{ 
                  opacity: 1, 
                  mixBlendMode: 'luminosity',
                  filter: 'brightness(0.6) contrast(1.1)'
                }}
              />
              <div className="position-relative z-index-10 h-100 d-flex flex-column justify-content-center p-5 text-white">
                <div style={{ maxWidth: '500px' }}>
                  <h1 className="display-4 fw-bold mb-4">Tham gia Cộng đồng Di động Đẳng cấp.</h1>
                  <p className="body-lg opacity-90 mb-5">
                    Khám phá tương lai của dịch vụ thuê xe với trải nghiệm cá nhân hóa và đội xe đẳng cấp nhất thế giới.
                  </p>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 backdrop-blur p-3 rounded-4 border border-white border-opacity-10 shadow-sm">
                      <div className="bg-white bg-opacity-20 p-2 rounded-circle">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="label-sm fw-bold text-uppercase tracking-wider">Được tin dùng bởi 50,000+</div>
                        <div className="body-md opacity-75">Thành viên Premium trên toàn cầu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="position-absolute bottom-0 start-0 w-100 h-50 bg-gradient-to-t from-primary opacity-80" style={{ pointerEvents: 'none' }}></div>
            </Col>

            {/* Right Side: Register Form Section */}
            <Col lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5">
              <div className="w-100" style={{ maxWidth: '550px' }}>
                <div className="text-center text-lg-start mb-4">
                  <h2 className="fw-bold text-primary mb-2">Tạo tài khoản mới</h2>
                  <p className="text-muted body-md">Nâng tầm hành trình của bạn cùng EliteDrive ngay hôm nay.</p>
                </div>

                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  {error && (
                    <div className="alert alert-danger py-2 small border-0 shadow-sm rounded-3">
                      {error}
                    </div>
                  )}

                  <BaseInput 
                    label="Họ và tên"
                    name="fullName"
                    icon={User}
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={formErrors.fullName}
                    required
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <BaseInput 
                        label="Địa chỉ Email"
                        name="email"
                        type="email"
                        icon={Mail}
                        placeholder="email@vi-du.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <BaseInput 
                        label="Số điện thoại"
                        name="phoneNumber"
                        icon={Phone}
                        placeholder="090 123 4567"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={formErrors.phoneNumber}
                        required
                      />
                    </Col>
                  </Row>


                  <Row className="g-3">
                    <Col md={6}>
                      <BaseInput 
                        label="Tên đăng nhập"
                        name="username"
                        icon={User}
                        placeholder="user123"
                        value={formData.username}
                        onChange={handleChange}
                        error={formErrors.username}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <BaseInput 
                        label="Số CCCD"
                        name="identifyId"
                        icon={ShieldCheck}
                        placeholder="0123456789"
                        value={formData.identifyId}
                        onChange={handleChange}
                        error={formErrors.identifyId}
                        required
                      />
                    </Col>
                  </Row>

                  <BaseInput 
                    label="Địa chỉ thường trú"
                    name="address"
                    icon={MapPin}
                    placeholder="123 Đường, Quận, Thành phố"
                    value={formData.address}
                    onChange={handleChange}
                    error={formErrors.address}
                    required
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <BaseInput 
                        label="Mật khẩu"
                        name="password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={formErrors.password}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <BaseInput 
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formErrors.confirmPassword}
                        required
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between align-items-center">
                    <BaseCheckbox 
                      label={<span>Tôi đồng ý với <Link to="/terms" className="text-primary fw-bold text-decoration-none">Điều khoản dịch vụ</Link></span>}
                      id="terms"
                      required
                    />
                  </div>

                  <BaseButton 
                    type="submit" 
                    className="w-100 py-3 shadow-md mt-2" 
                    isLoading={isSubmitting}
                  >
                    Đăng ký ngay
                  </BaseButton>

                  <div className="position-relative my-3 text-center">
                    <hr className="text-muted opacity-25" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-surface px-3 label-sm text-muted text-uppercase tracking-widest">
                      Hoặc đăng ký bằng
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                    className="btn btn-outline-light border text-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 hover-bg-light transition-all rounded-3"
                  >
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style={{ width: '18px' }} />
                    <span className="label-md fw-bold">Tiếp tục với Google</span>
                  </button>

                  <div className="text-center pt-3">
                    <p className="body-md text-muted">
                      Đã có tài khoản? <Link to="/login" className="text-primary fw-bold text-decoration-none">Đăng nhập ngay</Link>
                    </p>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Register;
