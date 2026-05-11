import React, { useRef } from 'react';
import { Camera, User, Check, Loader2, Edit3, Save, X } from 'lucide-react';
import { AuthRepository } from '../../auth/api/AuthRepository.js';

const ProfileHeader = ({ 
  profileData, 
  isEditing, 
  setIsEditing, 
  onSave, 
  isUpdating,
  onProfileUpdate 
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const fullName = profileData?.fullName || 'Tên người dùng';
  const memberSince = profileData?.memberSince || '2021';
  const isVerified = profileData?.isVerified ?? true;
  const avatarUrl = profileData?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCDPKRUjCCJW3IxuJmixehQLrKaOx0KNveC302SlcvwGeNlKbK_gGgY2HtL-Bh5eRmhpQbJAkOJ708vCk30Ccl8Yv6tDmoQQhrw63_8-q6oCMV3_LCkW-bRHTVeZICf7KCTLubix2nR3GCxlVkDODwN7bJxoN0avrG-SOeXR1LENo84fSZi6JdRupgryCNJx4vL4mUdgIUo64OdhVov83lG7iMVXuQ6afA3kyLLASk4AaQV9zif8bCZlSiPlu6yk53pC0wy-zPklJc";

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await AuthRepository.uploadAvatar(file);
      
      const updateRequest = { 
        ...profileData,
        avatarUrl: result.url
      };
      
      await AuthRepository.updateProfile(updateRequest);
      if (onProfileUpdate) {
        onProfileUpdate({ ...profileData, avatarUrl: result.url });
      }
    } catch (error) {
      alert(`Tải ảnh thất bại: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-4 p-4 p-md-5 soft-elevation mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="d-none" />
      
      <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
        {/* Avatar Section with Integrated Edit Action */}
        <div className="position-relative">
          <div className="avatar-wrapper" style={{ width: '120px', height: '120px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-100 h-100 object-fit-cover" />
            ) : (
              <User size={60} className="text-muted" />
            )}
            
            {/* Edit Overlay */}
            <div className="avatar-edit-overlay" onClick={handleEditPhotoClick}>
              {isUploading ? <Loader2 size={24} className="spin-animation" /> : <Camera size={24} />}
            </div>
          </div>
          
          {isVerified && !isUploading && (
            <div className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
              <Check size={18} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        
        {/* User Info Section */}
        <div>
          <h1 className="fw-bold text-primary mb-1 tracking-tight" style={{ fontSize: '32px' }}>{fullName}</h1>
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 label-sm">Thành viên Đã xác thực</span>
            <span className="text-muted d-none d-sm-inline">•</span>
            <span className="text-muted body-md fw-medium">Thành viên từ {memberSince}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons Section - Simplified */}
      <div className="d-flex gap-2">
        {isEditing ? (
          <>
            <button 
              onClick={() => setIsEditing(false)}
              className="btn btn-outline-light text-muted border px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2"
            >
              <X size={18} /> Hủy
            </button>
            <button 
              onClick={onSave}
              disabled={isUpdating}
              className="btn btn-cta px-4 py-2 rounded-3 d-flex align-items-center gap-2"
            >
              {isUpdating ? <Loader2 size={18} className="spin-animation" /> : <Save size={18} />}
              Lưu thay đổi
            </button>
          </>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-outline-primary px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2"
          >
            <Edit3 size={18} /> Chỉnh sửa hồ sơ
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
