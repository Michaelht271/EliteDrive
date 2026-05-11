import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Mail, Lock, ShieldCheck, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseInput from '../../components/ui/BaseInput.jsx';
import BaseButton from '../../components/ui/BaseButton.jsx';
import BaseCheckbox from '../../components/ui/BaseCheckbox.jsx';
import { validateLoginForm } from '../../utils/validation.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validate Form
    const validation = validateLoginForm({ username, password });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    if (result.success) {
      // ... logic chuyển hướng giữ nguyên
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const roles = (storedUser?.authorities || []).map(auth => 
        typeof auth === 'string' ? auth : auth.authority
      );

      const isCustomerOnly = roles.includes('ROLE_CUSTOMER') && 
                             !roles.includes('ROLE_ADMIN') && 
                             !roles.includes('ROLE_STAFF');

      const defaultPath = isCustomerOnly ? '/' : '/dashboard';
      const from = location.state?.from?.pathname || defaultPath;
      
      navigate(from, { replace: true });
    } else {
      // NỔI BẬT: Hiển thị lỗi từ Backend hoặc lỗi mặc định
      setError(result.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-surface overflow-x-hidden">
      <Header />
      
      <main className="flex-grow-1 d-flex align-items-stretch">
        <Container fluid className="p-0">
          <Row className="g-0 h-100">
            {/* Left Side: Image Section */}
            <Col lg={6} className="d-none d-lg-block position-relative bg-primary overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920" 
                alt="Luxury car" 
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                style={{ 
                  opacity: 1, 
                  mixBlendMode: 'luminosity',
                  filter: 'brightness(0.7) contrast(1.1)'
                }}
              />
              <div className="position-relative z-index-10 h-100 d-flex flex-column justify-content-center p-5 text-white">
                <div style={{ maxWidth: '500px' }}>
                  <h1 className="display-4 fw-bold mb-4">Elevate your journey with EliteDrive</h1>
                  <p className="body-lg opacity-90 mb-5">
                    Trải nghiệm dịch vụ thuê xe cao cấp hàng đầu. Chúng tôi mang đến sự tin cậy, sang trọng và tiện nghi trên mọi nẻo đường của bạn.
                  </p>
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur px-4 py-2 rounded-pill border border-white border-opacity-20">
                      <ShieldCheck size={18} />
                      <span className="label-sm text-uppercase tracking-wider">Dịch vụ cao cấp</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur px-4 py-2 rounded-pill border border-white border-opacity-20">
                      <Headphones size={18} />
                      <span className="label-sm text-uppercase tracking-wider">Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="position-absolute bottom-0 start-0 w-100 h-50 bg-gradient-to-t from-primary opacity-80" style={{ pointerEvents: 'none' }}></div>
            </Col>

            {/* Right Side: Form Section */}
            <Col lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center text-lg-start mb-5">
                  <h2 className="fw-bold text-primary mb-2">Chào mừng trở lại</h2>
                  <p className="text-muted body-md">Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.</p>
                </div>

                <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  {error && (
                    <div className="alert alert-danger py-2 small border-0 shadow-sm rounded-3">
                      {error}
                    </div>
                  )}

                  <BaseInput 
                    label="Email hoặc Số điện thoại"
                    icon={Mail}
                    placeholder="email@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={formErrors.username}
                    required
                  />

                  <BaseInput 
                    label="Mật khẩu"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password}
                    required
                  />


                  <div className="d-flex align-items-center justify-content-between my-2">
                    <BaseCheckbox label="Ghi nhớ đăng nhập" id="rememberMe" />
                    <Link to="/forgot-password" className="label-md text-primary fw-bold text-decoration-none">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <BaseButton 
                    type="submit" 
                    className="w-100 py-3 shadow-md mt-2" 
                    isLoading={isSubmitting}
                  >
                    Đăng nhập
                  </BaseButton>

                  <div className="position-relative my-4 text-center">
                    <hr className="text-muted opacity-25" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-surface px-3 label-sm text-muted text-uppercase tracking-widest">
                      Hoặc
                    </span>
                  </div>

              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="btn btn-outline-light border text-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 hover-bg-light transition-all rounded-3"
              >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" style={{ width: '20px' }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span className="label-md fw-bold">Tiếp tục với Google</span>
                  </button>

                  <div className="text-center pt-3">
                    <p className="body-md text-muted">
                      Bạn chưa có tài khoản? <Link to="/register" className="text-primary fw-bold text-decoration-none">Đăng ký ngay</Link>
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

export default Login;
