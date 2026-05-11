import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Card } from 'react-bootstrap';
import { Mail, Lock, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseInput from '../../components/ui/BaseInput.jsx';
import BaseButton from '../../components/ui/BaseButton.jsx';
import api from '../../infrastructure/api/axios.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-surface-container-low">
      <Header />
      
      <Container className="d-flex align-items-center justify-content-center p-4 flex-grow-1">
        <Card className="border-0 shadow-sm p-4 p-md-5 w-100 d-flex flex-column align-items-center text-center" style={{ maxWidth: '480px', borderRadius: '20px' }}>
          <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-4">
            <Lock size={32} className="text-primary" />
          </div>

          <div className="mb-4">
            <h1 className="h2 fw-bold text-primary mb-2">Quên mật khẩu?</h1>
            <p className="text-muted body-md px-2">
              Nhập địa chỉ email liên kết với tài khoản EliteDrive của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="w-100 text-start">
            {message && <div className="alert alert-success py-2 small mb-4 border-0 shadow-sm">{message}</div>}
            {error && <div className="alert alert-danger py-2 small mb-4 border-0 shadow-sm">{error}</div>}

            <BaseInput 
              label="Địa chỉ Email"
              icon={Mail}
              type="email"
              placeholder="nhan.vien@elitedrive.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <BaseButton 
              type="submit" 
              className="w-100 py-3 mt-4 d-flex align-items-center justify-content-center gap-2" 
              isLoading={isSubmitting}
            >
              Gửi mã xác nhận
              <ArrowRight size={18} />
            </BaseButton>
          </Form>

          <div className="mt-5 d-flex flex-column align-items-center gap-3 w-100">
            <Link to="/login" className="text-primary fw-bold text-decoration-none label-md d-flex align-items-center gap-2">
              <ArrowLeft size={18} /> Quay lại Đăng nhập
            </Link>
          </div>
        </Card>
      </Container>

      <PublicFooter />
    </div>
  );
};

export default ForgotPassword;
