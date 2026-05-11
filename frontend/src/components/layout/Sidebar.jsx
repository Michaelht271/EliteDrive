import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar, 
  History, 
  Heart, 
  UserCircle, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ show, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Lấy danh sách quyền từ authorities hoặc roles (đảm bảo tương thích cũ/mới)
  const getAuthorities = () => {
    if (!user) return [];
    
    // Ưu tiên authorities từ Spring Security
    if (user.authorities && Array.isArray(user.authorities)) {
      return user.authorities.map(auth => {
        const val = typeof auth === 'string' ? auth : (auth.authority || auth.role || '');
        return val.toUpperCase();
      });
    }
    
    // Dự phòng trường hợp dùng roles trực tiếp
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.map(role => {
        const val = typeof role === 'string' ? role : (role.name || '');
        return val.startsWith('ROLE_') ? val.toUpperCase() : `ROLE_${val.toUpperCase()}`;
      });
    }
    
    return [];
  };

  const authorities = getAuthorities();
  const isAdmin = authorities.includes('ROLE_ADMIN') || authorities.includes('ADMIN');
  const isStaff = authorities.includes('ROLE_STAFF') || authorities.includes('STAFF');
  const isCustomer = authorities.includes('ROLE_CUSTOMER') || authorities.includes('CUSTOMER');

  const dashboardPath = isAdmin ? '/admin/dashboard' : isStaff ? '/staff/dashboard' : (isCustomer ? '/customer/dashboard' : '/dashboard');

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Nav.Link 
        as={Link} 
        to={to} 
        className={`d-flex align-items-center gap-3 px-4 py-3 rounded-3 mb-2 transition-all ${
          isActive 
            ? 'bg-white bg-opacity-10 text-white fw-bold shadow-sm' 
            : 'text-white text-opacity-75 hover-bg-white hover-bg-opacity-5 hover-text-white'
        }`}
        style={{ 
          textDecoration: 'none',
          borderLeft: isActive ? '4px solid #0dcaf0' : '4px solid transparent'
        }}
      >
        <Icon size={20} className={isActive ? 'text-info' : 'text-white-50'} />
        <span>{label}</span>
      </Nav.Link>
    );
  };

  return (
    <>
      {show && (
        <div className="sidebar-overlay d-lg-none" onClick={onClose} />
      )}
      <div 
        className={`sidebar p-3 h-100 d-flex flex-column shadow-lg ${show ? 'show' : ''}`}
      >
        <div className="px-3 py-4 mb-3 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h3 className="fw-bold text-white mb-0 tracking-tight">EliteDrive</h3>
            <small className="text-info fw-semibold text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>
              {isAdmin ? 'Cổng Admin' : isStaff ? 'Cổng Nhân viên' : isCustomer ? 'Thành viên Premium' : 'Khách hàng'}
            </small>
          </Link>
          <button className="btn btn-link text-white d-lg-none p-0 border-0 shadow-none" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <Nav className="flex-column flex-grow-1 mt-3">
        <NavItem to={dashboardPath} icon={LayoutDashboard} label="Bảng điều khiển" />

        {isAdmin && (
          <>
            <NavItem to="/admin/users" icon={Users} label="Quản lý người dùng" />
            <NavItem to="/admin/cars" icon={Car} label="Quản lý đội xe" />
            {/*<NavItem to="/admin/bookings" icon={Calendar} label="Tất cả đơn đặt" />*/}
          </>
        )}

        {isStaff && (
          <>
            <NavItem to="/staff/rentals" icon={Calendar} label="Quản lý thuê xe" />
            {/*<NavItem to="/staff/fleet" icon={Car} label="Trạng thái đội xe" />*/}
          </>
        )}

        {isCustomer && (
          <>
            <NavItem to="/cars" icon={Car} label="Thuê xe ngay" />
            <NavItem to="/customer/history" icon={History} label="Lịch sử thuê xe" />
            <NavItem to="/customer/favorites" icon={Heart} label="Xe yêu thích" />
          </>
        )}
      </Nav>

      <div className="mt-auto pt-3 border-top border-white border-opacity-10">
        <NavItem to="/profile" icon={UserCircle} label="Cài đặt tài khoản" />
        <button 
          onClick={logout}
          className="btn btn-link nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-3 text-danger w-100 text-start border-0 hover-bg-danger hover-bg-opacity-10 mt-1"
        >
          <LogOut size={20} />
          <span className="fw-bold">Đăng xuất</span>
        </button>
      </div>
    </div>
</>
  );
};

export default Sidebar;
