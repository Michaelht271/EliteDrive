import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AlertCircle, CheckCircle2, Info, HelpCircle, X } from 'lucide-react';

/**
 * BaseModal Component nâng cấp hỗ trợ nhập liệu (Reason)
 */
const BaseModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', 
  confirmLabel = 'Xác nhận', 
  cancelLabel = 'Hủy',
  loading = false,
  showInput = false,
  inputPlaceholder = 'Nhập lý do tại đây...',
  inputValue = '',
  onInputChange = () => {}
}) => {
  
  const getConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle size={48} className="text-danger" />,
          btnVariant: 'danger',
          headerClass: 'bg-danger bg-opacity-10 text-danger'
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={48} className="text-success" />,
          btnVariant: 'success',
          headerClass: 'bg-success bg-opacity-10 text-success'
        };
      case 'info':
        return {
          icon: <Info size={48} className="text-primary" />,
          btnVariant: 'primary',
          headerClass: 'bg-primary bg-opacity-10 text-primary'
        };
      default: // confirm
        return {
          icon: <HelpCircle size={48} className="text-warning" />,
          btnVariant: 'primary',
          headerClass: 'bg-light text-dark'
        };
    }
  };

  const config = getConfig();

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      backdrop="static" 
      keyboard={!loading}
      className="base-modal border-0"
    >
      <Modal.Header className={`border-0 p-4 d-flex align-items-center justify-content-between ${config.headerClass}`} style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
        <Modal.Title className="h5 fw-black mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>
          {title || 'Xác nhận hành động'}
        </Modal.Title>
        {!loading && <Button variant="link" className="p-0 text-dark opacity-50 hover-opacity-100 shadow-none border-0" onClick={onHide}><X size={20} /></Button>}
      </Modal.Header>

      <Modal.Body className="p-5 text-center">
        <div className="mb-4 d-flex justify-content-center">
          {config.icon}
        </div>
        <h4 className="fw-black text-dark mb-3" style={{ fontSize: '1.25rem' }}>{message}</h4>
        
        {showInput ? (
          <div className="mt-4 text-start">
            <Form.Label className="small fw-bold text-muted text-uppercase">Lý do thực hiện (Bắt buộc)</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              placeholder={inputPlaceholder}
              className="rounded-3 border-2 p-3 small fw-medium shadow-none"
              style={{ 
                backgroundColor: '#f8fafc', 
                borderColor: '#e2e8f0',
                color: '#0f172a'
              }}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#001e40'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              required
            />
          </div>
        ) : (
          <p className="text-muted mb-0 small fw-medium">
            Hành động này có thể ảnh hưởng đến dữ liệu trong hệ thống. Vui lòng kiểm tra kỹ trước khi tiếp tục.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 p-4 bg-light bg-opacity-50 gap-2" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <Button 
          variant="white" 
          className="border fw-bold px-4 rounded-3 shadow-none" 
          onClick={onHide}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button 
          variant={config.btnVariant} 
          className={`fw-black px-4 rounded-3 shadow-sm border-0 ${type === 'danger' ? 'bg-danger' : 'bg-primary'}`} 
          onClick={onConfirm}
          disabled={loading || (showInput && !inputValue.trim())}
        >
          {loading ? 'Đang xử lý...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BaseModal;
