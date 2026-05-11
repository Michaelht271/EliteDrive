import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children, roles: requiredRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Chuẩn hóa user roles thành mảng string
  const userRoles = (user.authorities || []).map(auth => 
    typeof auth === 'string' ? auth : auth.authority
  );

  // Nếu route yêu cầu roles cụ thể mà user không có, chuyển hướng về dispatcher
  if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
    // Chỉ redirect nếu không ở chính trang /dashboard để tránh loop
    if (location.pathname !== '/dashboard') {
      return <Navigate to="/dashboard" replace />;
    } else {
      // Nếu đang ở /dashboard mà vẫn bị từ chối (trường hợp hiếm), đưa về profile
      return <Navigate to="/profile" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
