import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Lock, Globe, Bell, ChevronRight, LogOut, Download } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal.jsx';

const SettingsSidebar = ({ onLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const SettingItem = ({ icon: Icon, label, sublabel, onClick }) => (
    <Button 
      variant="white" 
      className="w-100 border rounded-3 p-3 mb-3 text-start d-flex align-items-center justify-content-between hover-bg-light shadow-xs"
      style={{ borderColor: '#f1f1f1' }}
      onClick={onClick}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="bg-light p-2 rounded-3 text-secondary">
          <Icon size={18} />
        </div>
        <div>
          <div className="fw-bold small text-dark" style={{ color: '#001e40' }}>{label}</div>
          <div className="text-muted" style={{ fontSize: '10px' }}>{sublabel}</div>
        </div>
      </div>
      <ChevronRight size={16} className="text-muted opacity-50" />
    </Button>
  );

  return (
    <div className="d-flex flex-column gap-4">
      <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-4" style={{ color: '#001e40' }}>Cài đặt tài khoản</h5>
        <SettingItem 
          icon={Lock} 
          label="Mật khẩu" 
          sublabel="Cập nhật mật khẩu đăng nhập" 
          onClick={() => setShowPasswordModal(true)}
        />
        <SettingItem icon={Globe} label="Ngôn ngữ" sublabel="Tiếng Việt" />
        <SettingItem icon={Bell} label="Thông báo" sublabel="Email, Đẩy và SMS" />
      </Card>

      <ChangePasswordModal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)} 
      />

      <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-4" style={{ color: '#001e40' }}>Thao tác nhanh</h5>
        <div className="d-grid gap-3">
          <Button variant="light" className="py-3 fw-bold text-dark rounded-3 border-0 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '14px' }}>
            <Download size={18} /> Tải về lịch sử thuê xe
          </Button>
          <Button 
            variant="outline-danger" 
            className="py-3 fw-bold rounded-3 border-2 d-flex align-items-center justify-content-center gap-2"
            onClick={onLogout}
            style={{ fontSize: '14px' }}
          >
            <LogOut size={18} /> Đăng xuất tài khoản
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsSidebar;
