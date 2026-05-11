import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { AuthRepository } from '../../auth/api/AuthRepository.js';

const ChangePasswordModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await AuthRepository.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        onHide();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary">Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4">
        {error && <Alert variant="danger" className="py-2 small border-0">{error}</Alert>}
        {success && <Alert variant="success" className="py-2 small border-0">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted">Mật khẩu hiện tại</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="bg-light border-0 py-2"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button 
                type="button"
                className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                onClick={() => togglePasswordVisibility('old')}
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted">Mật khẩu mới</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="bg-light border-0 py-2"
                placeholder="Ít nhất 6 ký tự"
              />
              <button 
                type="button"
                className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-muted">Xác nhận mật khẩu mới</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-light border-0 py-2"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button 
                type="button"
                className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2 fw-bold shadow-sm rounded-3"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Cập nhật mật khẩu'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
