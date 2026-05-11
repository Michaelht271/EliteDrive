import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { ShoppingBag, Star, ShieldCheck, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthRepository } from '../auth/api/AuthRepository.js';
import { RentalRepository } from '../../data/repositories/RentalRepository.js';
import { validateProfileForm } from '../../utils/validation.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { SimpleLineChart } from '../../components/ui/SimpleCharts.jsx';

// Sub-components
import ProfileHeader from './components/ProfileHeader.jsx';
import PersonalInfoCard from './components/PersonalInfoCard.jsx';
import SettingsSidebar from './components/SettingsSidebar.jsx';
import VerificationBanner from './components/VerificationBanner.jsx';

const CustomerDashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [recentRental, setRecentRental] = useState(null);
  const [stats, setStats] = useState({ totalTrips: 0, points: 0 });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data cho biểu đồ
  const travelActivity = [0, 2, 1, 5, 3, 4, 6];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, rentalsData] = await Promise.all([
          AuthRepository.getProfile(),
          RentalRepository.getMyRentals({ page: 0, size: 5 })
        ]);
        
        setProfileData(profile);
        
        if (rentalsData?.content && rentalsData.content.length > 0) {
          setRecentRental(rentalsData.content[0]);
          setStats({
            totalTrips: rentalsData.totalElements || rentalsData.content.length,
            points: (rentalsData.totalElements || 0) * 100 // Tạm tính điểm
          });
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validation = validateProfileForm(profileData, { isAdmin: false, isStaff: false });
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError('Vui lòng kiểm tra lại thông tin nhập vào');
      return;
    }

    setIsUpdating(true);
    setErrors({});
    setError('');
    setSuccess('');

    const updateRequest = {
      fullName: profileData.fullName,
      address: profileData.address,
      phoneNumber: profileData.phoneNumber,
      avatarUrl: profileData.avatarUrl,
      dateOfBirth: profileData.dateOfBirth,
      identifyId: profileData.identifyId,
      driverLicenceId: profileData.driverLicenceId
    };

    const result = await updateProfile(updateRequest);
    if (result.success) {
      setSuccess('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Lỗi cập nhật hồ sơ');
    }
    setIsUpdating(false);
  };

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
        <ProfileHeader 
          profileData={profileData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSubmit}
          isUpdating={isUpdating}
          onProfileUpdate={(updated) => setProfileData(updated)}
        />

        {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-4 border-0 shadow-sm mb-4">{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-4 border-0 shadow-sm mb-4">{success}</Alert>}

        {/* Quick Stats */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: '#001e40', color: '#000000' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="small fw-bold uppercase mb-1">Chuyến đi đã thực hiện</div>
                  <h2 className="fw-black mb-0" style={{ color: '#1378ea' }}>{stats.totalTrips}</h2>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-3">
                  <ShoppingBag size={24} color="#ffffff" />
                </div>
              </div>
              <div className="mt-4 small d-flex align-items-center gap-1" style={{ color: 'rgba(201,82,2,0.98)' }}>
                <ShieldCheck size={14} /> Thành viên hạng Gold
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="small text-muted fw-bold uppercase mb-1">Điểm tích lũy</div>
                  <h2 className="fw-black text-dark mb-0">{stats.points.toLocaleString()}</h2>
                </div>
                <div className="bg-warning bg-opacity-10 p-2 rounded-3 text-warning">
                  <Star size={24} />
                </div>
              </div>
              <div className="mt-4 small text-primary fw-bold cursor-pointer">
                Đổi ưu đãi ngay <ChevronRight size={14} />
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h6 className="small text-muted fw-bold uppercase mb-3 text-center">Hoạt động 7 ngày qua</h6>
              <SimpleLineChart data={travelActivity} color="#fd8b00" height={60} />
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8} className="d-flex flex-column gap-4">
            <PersonalInfoCard 
              profileData={profileData} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing}
              handleChange={handleChange} 
              onSave={handleSubmit}
              isUpdating={isUpdating}
              errors={errors}
            />
            <VerificationBanner />
          </Col>
          
          <Col lg={4}>
            <SettingsSidebar onLogout={logout} />
            
            {/* Recent Trip Preview (Card Detail) */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mt-4 bg-white">
              <h5 className="fw-black text-dark mb-4">Chuyến đi gần nhất</h5>
              {recentRental ? (
                <>
                  <div className="d-flex gap-3 align-items-start pb-3 border-bottom mb-3">
                    <div className="bg-light p-2 rounded-3 text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="small fw-black text-dark">{recentRental.carName}</div>
                      <div className="text-muted" style={{ fontSize: '10px' }}>
                        {new Date(recentRental.startDate).toLocaleDateString('vi-VN')} - {new Date(recentRental.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small fw-bold">
                    <MapPin size={14} /> EliteDrive Showroom HN
                  </div>
                  <div className="mt-3">
                    <span className={`badge rounded-pill px-3 py-1 ${recentRental.status === 'COMPLETED' ? 'bg-success' : 'bg-primary'} bg-opacity-10 text-uppercase`} style={{ fontSize: '9px', color: recentRental.status === 'COMPLETED' ? '#10b981' : '#003366' }}>
                      {recentRental.status}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle size={32} className="text-muted mb-2 opacity-25" />
                  <p className="text-muted small fw-bold mb-0">Chưa có chuyến đi nào</p>
                </div>
              )}
              <button 
                className="btn btn-primary w-100 mt-4 rounded-3 fw-bold small py-2 border-0 shadow-sm" 
                style={{ backgroundColor: '#003366' }}
                onClick={() => (window.location.href='/customer/history')}
              >
                Xem toàn bộ lịch sử
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
