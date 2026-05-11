import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Lock, Globe, Bell, ChevronRight } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal.jsx';

const SettingItem = ({ icon: Icon, label, sublabel, onClick }) => (
  <button 
    className="w-100 d-flex align-items-center justify-content-between p-3 rounded-3 border border-light bg-white hover-bg-light transition-all mb-3 text-start shadow-sm"
    onClick={onClick}
  >
    <div className="d-flex align-items-center gap-3">
      <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary transition-all">
        <Icon size={20} />
      </div>
      <div>
        <p className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{label}</p>
        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sublabel}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-muted opacity-50" />
  </button>
);

const AccountSettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="bg-white rounded-4 p-4 soft-elevation mb-4">
      <h5 className="fw-bold text-dark mb-4">Cài đặt tài khoản</h5>
      
      <SettingItem 
        icon={Lock} 
        label="Mật khẩu" 
        sublabel="Thay đổi mật khẩu đăng nhập của bạn" 
        onClick={() => setShowPasswordModal(true)}
      />
      
      <SettingItem 
        icon={Globe} 
        label="Ngôn ngữ" 
        sublabel="Tiếng Việt (Vietnam)" 
      />
      
      <SettingItem 
        icon={Bell} 
        label="Thông báo" 
        sublabel="Email, Thông báo ứng dụng" 
      />

      <ChangePasswordModal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)} 
      />
    </div>
  );
};

export default AccountSettings;
