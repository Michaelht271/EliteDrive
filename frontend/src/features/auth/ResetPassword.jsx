import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Form, Card } from 'react-bootstrap';
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseInput from '../../components/ui/BaseInput.jsx';
import BaseButton from '../../components/ui/BaseButton.jsx';
import api from '../../infrastructure/api/axios.js';
import { validatePassword } from '../../utils/validation.js';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return setError('Token không hợp lệ hoặc đã hết hạn.');

        const passError = validatePassword(password);
        if (passError) return setError(passError);

        if (password !== confirmPassword) return setError('Mật khẩu xác nhận không khớp.');

        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Token có thể đã hết hạn.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-vh-100 d-flex flex-column bg-surface">
                <Header />
                <Container className="d-flex justify-content-center">
                    <Card className  ="border-0 shadow-lg p-5 text-center" style={{ maxWidth: '500px', borderRadius: '24px' }}>
                        <div className="bg-success bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4 mx-auto">
                            <CheckCircle size={48} className="text-success" />
                        </div>
                        <h1 className="fw-bold text-primary mb-3">Thành công!</h1>
                        <p className="text-muted body-lg mb-4">Mật khẩu của bạn đã được thay đổi. Bạn có thể dùng mật khẩu mới để đăng nhập.</p>
                        <BaseButton onClick={() => navigate('/login')} variant="success" className="py-3 w-100">Đăng nhập ngay</BaseButton>
                    </Card>
                </Container>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column bg-surface">
            <Header />
            <main className=" d-flex align-items-center justify-content-center p-4">
                <Card className="border-0 shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: '480px', borderRadius: '20px' }}>
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-4">
                            <Lock size={32} className="text-primary" />
                        </div>
                        <h1 className="h2 fw-bold text-primary mb-2">Đặt lại mật khẩu</h1>
                        <p className="text-muted body-md">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                    </div>

                    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        {error && <div className="alert alert-danger py-2 small border-0 shadow-sm">{error}</div>}

                        <BaseInput
                            label="Mật khẩu mới"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <BaseInput
                            label="Xác nhận mật khẩu mới"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <BaseButton
                            type="submit"
                            className="w-100 py-3 shadow-md mt-3 d-flex align-items-center justify-content-center gap-2"
                            isLoading={isSubmitting}
                        >
                            Cập nhật mật khẩu
                            <ArrowRight size={18} />
                        </BaseButton>
                    </Form>

                    <div className="mt-4 pt-4 border-top text-center">
                        <Link to="/login" className="text-muted text-decoration-none label-md">
                            Hủy bỏ và quay lại
                        </Link>
                    </div>
                </Card>
            </main>
            <PublicFooter />
        </div>
    );
};

export default ResetPassword;
