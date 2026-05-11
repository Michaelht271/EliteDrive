import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthRepository } from './api/AuthRepository.js';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let token = params.get('token');

    if (token) {
      // Đảm bảo token sạch (không bị dính chữ Bearer nếu backend lỡ gửi kèm)
      token = token.replace('Bearer ', '').trim();
      localStorage.setItem('token', token);
      
      // Fetch user details with the new token
      AuthRepository.getCurrentUser()
        .then(userDetails => {
          setUser(userDetails);
          localStorage.setItem('user', JSON.stringify(userDetails));
          
          // Redirect based on role (similar to login logic)
          const roles = (userDetails.authorities || []).map(auth => 
            typeof auth === 'string' ? auth : auth.authority
          );
          
          if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF')) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        })
        .catch(error => {
          console.error('Failed to fetch user details after Google login:', error);
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate, setUser]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-surface">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h4 className="text-primary fw-bold">Authenticating with Google...</h4>
        <p className="text-muted small">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
