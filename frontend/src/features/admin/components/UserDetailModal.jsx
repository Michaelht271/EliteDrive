import React from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { 
  X, Calendar, MapPin, Phone, Mail, Fingerprint, 
  CreditCard, Hash, Clock, Wallet, Briefcase, Activity, Edit
} from 'lucide-react';
import { StatusBadge, RoleBadge } from './UserBadges.jsx';

const UserDetailModal = ({ show, onHide, user }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="user-detail-modal">
      <Modal.Body className="p-0 overflow-hidden rounded-5 shadow-2xl">
        <div className="bg-white">
          {/* Header Banner */}
          <div className="position-relative" style={{ height: '140px', background: 'linear-gradient(135deg, #001e40 0%, #003366 100%)' }}>
            <div className="position-absolute top-0 end-0 p-4">
              <Button variant="link" className="text-white p-0 opacity-50 hover-opacity-100 shadow-none border-0" onClick={onHide}><X size={28} /></Button>
            </div>
            <div className="position-absolute" style={{ bottom: '-50px', left: '40px' }}>
              <img 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || user.username}&background=fff&color=001e40&size=200&bold=true`} 
                alt="" 
                className="rounded-circle border border-4 border-white shadow-xl"
                style={{ width: '120px', height: '120px', objectFit: 'cover', background: '#fff' }}
              />
            </div>
          </div>

          <div className="p-5 pt-5 mt-4">
            <div className="d-flex justify-content-between align-items-start mb-5">
              <div>
                <h2 className="fw-black text-dark mb-1" style={{ fontSize: '2rem', letterSpacing: '-1px' }}>{user.fullName || user.username}</h2>
                <div className="d-flex gap-2 align-items-center">
                  <span className="text-muted fw-bold">@{user.username}</span>
                  <span className="text-muted">•</span>
                  <RoleBadge type={user.userType} simple />
                  <StatusBadge enabled={user.enabled} />
                </div>
              </div>
              <div className="text-end">
                <div className="text-muted small fw-black text-uppercase" style={{ letterSpacing: '1px' }}>Ngày gia nhập</div>
                <div className="fw-black text-primary">{new Date(user.createdDate).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            <Row className="g-4">
              <Col md={4}>
                <div className="bg-light bg-opacity-50 p-4 rounded-4 h-100 border border-light">
                  <h6 className="fw-black text-muted text-uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '2px' }}>Tài khoản</h6>
                  <div className="d-flex flex-column gap-3">
                    <InfoItem icon={Hash} label="User ID" value={`#${user.userId}`} />
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={Activity} label="Phân quyền" value={user.roles?.join(', ') || 'N/A'} />
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-light bg-opacity-50 p-4 rounded-4 h-100 border border-light">
                  <h6 className="fw-black text-muted text-uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '2px' }}>Định danh</h6>
                  <div className="d-flex flex-column gap-3">
                    <InfoItem icon={Fingerprint} label="CCCD / ID" value={user.identifyId || 'Chưa cập nhật'} />
                    <InfoItem icon={CreditCard} label="Bằng lái xe" value={user.driverLicenceId || 'Chưa cập nhật'} />
                    <InfoItem icon={Calendar} label="Ngày sinh" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'} />
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-light bg-opacity-50 p-4 rounded-4 h-100 border border-light">
                  <h6 className="fw-black text-muted text-uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '2px' }}>Liên hệ</h6>
                  <div className="d-flex flex-column gap-3">
                    <InfoItem icon={Phone} label="Điện thoại" value={user.phoneNumber || 'N/A'} />
                    <InfoItem icon={MapPin} label="Địa chỉ" value={user.address || 'Chưa cập nhật'} />
                    <InfoItem icon={Briefcase} label="Nghề nghiệp" value="Thành viên" />
                  </div>
                </div>
              </Col>
            </Row>

            {user.userType === 'STAFF' && (
              <div className="mt-4 p-4 rounded-4" style={{ backgroundColor: '#001e40', color: '#fff' }}>
                <div className="d-flex justify-content-around text-center">
                  <div>
                    <div className="text-white text-opacity-50 text-uppercase fw-black mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>Ca làm việc</div>
                    <div className="h5 fw-black m-0 d-flex align-items-center gap-2 justify-content-center"><Clock size={18} className="text-warning" /> {user.shift || 'Sáng'}</div>
                  </div>
                  <div className="border-end border-white border-opacity-10"></div>
                  <div>
                    <div className="text-white text-opacity-50 text-uppercase fw-black mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>Lương cơ bản</div>
                    <div className="h5 fw-black m-0 d-flex align-items-center gap-2 justify-content-center"><Wallet size={18} className="text-warning" /> {user.salary?.toLocaleString() || '0'} VND</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-light border-top d-flex justify-content-end gap-2 px-5">
            <Button variant="white" className="border fw-bold px-4 rounded-3 shadow-none py-2" onClick={onHide}>Đóng lại</Button>
            <Button variant="primary" className="fw-black px-4 rounded-3 border-0 py-2 d-flex align-items-center gap-2 bg-primary">
              <Edit size={18} /> Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="d-flex align-items-center gap-3">
    <Icon size={18} className="text-primary opacity-70" />
    <div>
      <div className="text-muted" style={{ fontSize: '10px' }}>{label}</div>
      <div className="fw-bold small">{value}</div>
    </div>
  </div>
);

export default UserDetailModal;
