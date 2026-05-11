import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, InputGroup, Alert } from 'react-bootstrap';
import { User, Mail, Lock, Shield, UserPlus, X, BadgeCheck, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';

const UserFormModal = ({ show, onHide, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'STAFF'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [localError, setLocalError] = useState('');

  // Reset form khi đóng/mở
  useEffect(() => {
    if (show) {
      setFormData({
        username: '', email: '', password: '', confirmPassword: '', fullName: '', role: 'STAFF'
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      setValidated(false);
      setLocalError('');
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (localError) setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLocalError('');

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static" className="user-form-modal">
      <Modal.Body className="p-0 overflow-hidden rounded-4 shadow-2xl border-0">
        {/* Header */}
        <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#001e40' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-10 p-2 rounded-3">
              <UserPlus size={24} className="text-warning" />
            </div>
            <div>
              <h4 className="fw-black mb-0 text-uppercase" style={{ letterSpacing: '1px', fontSize: '18px' }}>Khởi tạo tài khoản hệ thống</h4>
              <p className="mb-0 small text-white-50">Cấp quyền truy cập cho nhân viên hoặc quản trị viên mới</p>
            </div>
          </div>
          <Button variant="link" className="text-white p-0 opacity-50 hover-opacity-100 shadow-none border-0" onClick={onHide} disabled={loading}>
            <X size={24} />
          </Button>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 p-md-5 bg-white">
          
          {error && (
            <Alert variant="danger" className="border-0 shadow-sm rounded-3 py-2 mb-4 d-flex align-items-center gap-2 small fw-bold">
              <ShieldAlert size={18} /> {error}
            </Alert>
          )}

          {localError && (
            <Alert variant="warning" className="border-0 shadow-sm rounded-3 py-2 mb-4 d-flex align-items-center gap-2 small fw-bold">
              <AlertCircle size={18} /> {localError}
            </Alert>
          )}

          <Row className="g-4">
            <Col md={12}>
              <h6 className="fw-black text-muted text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '2px' }}>Thông tin định danh</h6>
              <Form.Group controlId="fullName">
                <Form.Label className="small fw-bold text-dark">Họ và tên đầy đủ</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><User size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    name="fullName"
                    placeholder="VD: Nguyễn Văn An"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-2">Vui lòng nhập họ tên đầy đủ.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group controlId="username">
                <Form.Label className="small fw-bold text-dark">Tên đăng nhập</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><BadgeCheck size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    name="username"
                    minLength={5}
                    placeholder="minh_nguyen_99"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-2">Tên đăng nhập tối thiểu 5 ký tự.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="role">
                <Form.Label className="small fw-bold text-dark">Phân quyền hệ thống</Form.Label>
                <InputGroup className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Shield size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Select 
                    name="role"
                    className="border-0 py-2.5 fw-bold text-primary shadow-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="ADMIN">QUẢN TRỊ VIÊN (ADMIN)</option>
                    <option value="STAFF">NHÂN VIÊN (STAFF)</option>
                    <option value="CUSTOMER">KHÁCH HÀNG (CUSTOMER)</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="email">
                <Form.Label className="small fw-bold text-dark">Địa chỉ Email</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Mail size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    type="email"
                    name="email"
                    placeholder="example@elitedrive.vn"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-2">Vui lòng nhập địa chỉ email hợp lệ.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="password">
                <Form.Label className="small fw-bold text-dark">Mật khẩu khởi tạo</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><KeyRound size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    minLength={8}
                    placeholder="••••••••"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button 
                    variant="light" 
                    className="border-0 bg-transparent text-muted px-3" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-2">Mật khẩu tối thiểu 8 ký tự.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="confirmPassword">
                <Form.Label className="small fw-bold text-dark">Xác nhận mật khẩu</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Lock size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Button 
                    variant="light" 
                    className="border-0 bg-transparent text-muted px-3" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-2">Vui lòng xác nhận lại mật khẩu.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-5 p-4 rounded-4 border-0 d-flex justify-content-between align-items-center shadow-sm" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-muted small fw-medium pe-4">
              <span className="text-warning fw-bold">Lưu ý:</span> Kiểm tra kỹ các trường dữ liệu trước khi xác nhận.
            </div>
            <div className="d-flex gap-2">
              <Button variant="white" className="border-0 fw-bold px-4 rounded-3 shadow-none text-muted" onClick={onHide} disabled={loading}>Hủy bỏ</Button>
              <Button type="submit" variant="primary" className="fw-black px-4 rounded-3 border-0 shadow-lg d-flex align-items-center gap-2" 
                style={{ backgroundColor: '#fd7e14', fontSize: '14px' }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <UserPlus size={18} />} XÁC NHẬN TẠO
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;
