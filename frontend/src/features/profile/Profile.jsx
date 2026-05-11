import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthRepository } from '../auth/api/AuthRepository.js';
import { validateProfileForm } from '../../utils/validation.js';
import Layout from '../../components/layout/Layout.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';

// Reuse components from dashboard for consistency (Clean Code)
import ProfileHeader from '../dashboard/components/ProfileHeader.jsx';
import PersonalInfoCard from '../dashboard/components/PersonalInfoCard.jsx';
import SettingsSidebar from '../dashboard/components/SettingsSidebar.jsx';
import VerificationBanner from '../dashboard/components/VerificationBanner.jsx';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthRepository.getProfile();
        setProfileData(data);
      } catch (err) {
        setError('Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation logic
    const validation = validateProfileForm(profileData, { isAdmin, isStaff });
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError('Vui lòng kiểm tra lại thông tin nhập vào');
      return;
    }

    setIsUpdating(true);
    setErrors({});
    setError('');
    setSuccess('');

    // Filter only fields that the backend expects (Clean Code: Data Integrity)
    const updateRequest = {
      fullName: profileData.fullName,
      address: profileData.address,
      phoneNumber: profileData.phoneNumber,
      avatarUrl: profileData.avatarUrl,
      dateOfBirth: profileData.dateOfBirth,
      identifyId: profileData.identifyId,
      driverLicenceId: profileData.driverLicenceId
    };
    
    // Note: Salary and Shift are read-only for Staff in their own profile, 
    // so we don't include them in the update request to prevent accidental changes or backend errors.
    
    const result = await updateProfile(updateRequest);
    if (result.success) {
      setSuccess('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Cập nhật hồ sơ thất bại');
    }
    setIsUpdating(false);
  };

  const isAdmin = (user?.authorities || []).some(auth => 
    (typeof auth === 'string' ? auth : auth.authority) === 'ROLE_ADMIN'
  );

  const isStaff = (user?.authorities || []).some(auth => 
    (typeof auth === 'string' ? auth : auth.authority) === 'ROLE_STAFF'
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-5" style={{ backgroundColor: '#f3f3f6', minHeight: '100%' }}>
        <div className="mb-4">
          <h1 className="fw-bold text-primary tracking-tight" style={{ fontSize: '32px' }}>Hồ sơ của tôi</h1>
          <p className="text-muted body-md">Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-4 border-0 shadow-sm mb-4">{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-4 border-0 shadow-sm mb-4">{success}</Alert>}

        <ProfileHeader 
          profileData={profileData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSubmit}
          isUpdating={isUpdating}
          onProfileUpdate={(updated) => setProfileData(updated)}
        />

        <Row className="g-4">
          <Col lg={8} className="d-flex flex-column gap-4">
            <PersonalInfoCard 
              profileData={profileData} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing}
              handleChange={handleChange} 
              onSave={handleSubmit}
              isUpdating={isUpdating}
              showEditButton={false}
              isAdmin={isAdmin}
              isStaff={isStaff}
              errors={errors}
            />
            <VerificationBanner />
          </Col>
          
          <Col lg={4}>
            <SettingsSidebar onLogout={logout} />
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
