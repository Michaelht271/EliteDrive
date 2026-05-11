import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, LogOut, UserCircle, Bell, Settings, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="py-2 soft-elevation border-bottom z-50 bg-white">
      <Container className="px-3 px-lg-5">
        
        {/* 1. Logo - Luôn bên trái */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary tracking-tight me-auto me-lg-4">
          EliteDrive
        </Navbar.Brand>

        {/* 2. Vùng Action (Thông báo + Avatar) - Luôn hiển thị ở hàng trên cùng */}
        <div className="d-flex align-items-center gap-2 gap-md-3 order-lg-3">
          
          {/* Nút thông báo */}
          <button className="btn-icon p-2 position-relative border-0 bg-transparent text-muted">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          <div className="vr mx-1 text-light opacity-25 d-none d-sm-block" style={{ height: '24px' }}></div>

          {!user ? (
            <div className="d-flex align-items-center gap-1">
              <Link to="/login" className="btn btn-link text-primary fw-bold text-decoration-none d-none d-sm-block px-2" style={{ fontSize: '14px' }}>Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary px-3 rounded-pill fw-bold shadow-sm" style={{ fontSize: '13px' }}>Đăng ký</Link>
            </div>
          ) : (
            <NavDropdown
              title={
                <div className="avatar-wrapper" style={{ width: '38px', height: '38px' }}>
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserCircle size={30} className="text-primary" strokeWidth={1.5} />
                  )}
                </div>
              }
              id="user-dropdown"
              align="end"
              className="user-dropdown-custom no-caret"
            >
              <div className="dropdown-header px-3 py-2 border-bottom mb-1">
                <p className="mb-0 fw-bold text-primary small">{user.fullName || user.username}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>Thành viên Premium</p>
              </div>
              <NavDropdown.Item as={Link} to="/dashboard" className="d-flex align-items-center gap-3 py-2">
                <LayoutDashboard size={16} className="text-muted" /> <span className="small fw-medium">Bảng điều khiển</span>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-3 py-2">
                <Settings size={16} className="text-muted" /> <span className="small fw-medium">Cài đặt</span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-3 py-2 text-danger fw-bold">
                <LogOut size={16} /> <span className="small">Đăng xuất</span>
              </NavDropdown.Item>
            </NavDropdown>
          )}

          {/* Nút Toggle cho mobile - Đặt cuối cùng bên phải */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="border-0 p-1 shadow-none ms-1 order-last"
            onClick={user ? onMenuClick : undefined}
          >
            <Menu size={24} className="text-primary" />
          </Navbar.Toggle>
        </div>

        {/* 3. Vùng menu điều hướng - Căn giữa khi mở ra */}
        <Navbar.Collapse id="basic-navbar-nav" className="order-last order-lg-2">
          <Nav className="mx-lg-auto gap-lg-1 mt-3 mt-lg-0 text-center align-items-center">
            <Nav.Link as={NavLink} to="/" end className="fw-semibold px-3 py-2 py-lg-0">Trang chủ</Nav.Link>
            <Nav.Link as={NavLink} to="/cars" className="fw-semibold px-3 py-2 py-lg-0">Đội xe</Nav.Link>
            <Nav.Link as={NavLink} to="/customer/history" className="fw-semibold px-3 py-2 py-lg-0">Lịch sử</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default Header;
