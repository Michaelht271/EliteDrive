import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { ShieldCheck, History, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseButton from '../../components/ui/BaseButton.jsx';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(45);
  
  const inputRefs = useRef([]);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  // Kiểm tra xem có đúng là đến từ luồng Quên mật khẩu không
  const isFromForgotPassword = !!location.state?.fromForgotPassword;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    
    // Nếu người dùng xóa ký tự
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Lấy ký tự cuối cùng vừa nhập
    const char = val.slice(-1);
    
    // LOGIC KIỂM TRA:
    // Nếu là luồng Quên mật khẩu -> CHỈ nhận số
    // Nếu không (Đăng ký) -> Nhận TẤT CẢ (chữ và số)
    if (isFromForgotPassword && !/^\d$/.test(char)) {
      return; // Chặn nếu không phải số
    }

    const newOtp = [...otp];
    newOtp[index] = char.toUpperCase(); // Chuyển chữ hoa cho đồng bộ
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = await verifyOtp(email, otpCode);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Mã xác thực không hợp lệ");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex flex-column bg-surface">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <Card className="border-0 shadow-lg p-5 text-center" style={{ maxWidth: '500px', borderRadius: '24px' }}>
            <div className="bg-success bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4 mx-auto">
              <ShieldCheck size={48} className="text-success" />
            </div>
            <h2 className="fw-bold text-primary mb-3">Xác thực thành công</h2>
            <p className="text-muted body-lg mb-4">
              {isFromForgotPassword ? "Mã xác nhận chính xác. Bạn có thể tiến hành đổi mật khẩu." : "Tài khoản của bạn đã được kích hoạt thành công."}
            </p>
            <BaseButton onClick={() => navigate('/login')} variant="success" className="py-3 w-100">Tiếp tục</BaseButton>
          </Card>
        </Container>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-surface">
      <Header />
      
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Row className="w-100 justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '24px' }}>
              <div className="text-center mb-5">
                <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-4">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                <h1 className="h2 fw-bold text-primary mb-2">Xác thực OTP</h1>
                <p className="text-muted body-md">
                  Mã xác thực {isFromForgotPassword ? "(chỉ gồm số)" : "(chữ và số)"} đã được gửi đến <br/>
                  <strong className="text-primary-container">{email}</strong>
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger py-2 small mb-4 border-0 shadow-sm">{error}</div>}

                <div className="d-flex gap-2 gap-md-3 mb-5 justify-content-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      value={digit}
                      onChange={e => handleChange(index, e)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      className="form-control text-center fw-bold text-primary shadow-none"
                      style={{ 
                        width: '12%', 
                        minWidth: '45px',
                        height: '60px', 
                        fontSize: '22px', 
                        borderRadius: '12px',
                        border: '1.5px solid var(--outline-variant)'
                      }}
                    />
                  ))}
                </div>

                <BaseButton 
                  type="submit" 
                  className="w-100 py-3 shadow-md mb-4" 
                  isLoading={isSubmitting}
                  disabled={otp.some(d => !d)}
                >
                  Xác nhận
                </BaseButton>

                <div className="text-center mt-2">
                  <p className="text-muted body-md mb-0 d-flex align-items-center justify-content-center gap-2">
                    <History size={18} />
                    Gửi lại mã sau <span className="fw-bold text-primary">{formatTime(timer)}</span>
                  </p>
                </div>
              </Form>

              <div className="mt-4 pt-4 border-top text-center">
                <Link to="/register" className="text-muted text-decoration-none d-inline-flex align-items-center gap-2 label-md">
                  <ArrowLeft size={16} /> Quay lại trang đăng ký
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <PublicFooter />
    </div>
  );
};

export default VerifyOTP;
