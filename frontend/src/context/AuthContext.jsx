import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthRepository } from '../features/auth/api/AuthRepository.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  // Khởi tạo user ngay lập tức từ localStorage để tránh nháy giao diện
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ set loading false sau khi đã kiểm tra xong (useEffect chạy sau render đầu tiên)
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { token, username: resUsername } = await AuthRepository.login({ username, password });
      localStorage.setItem('token', token);
      
      const userDetails = await AuthRepository.getCurrentUser();
      const fullUser = { ...userDetails, username: resUsername };
      
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await AuthRepository.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const data = await AuthRepository.register(userData);
      return { success: true, data };
    } catch (error) {
      // Bóc tách lỗi chi tiết từ Backend
      const backendError = error.response?.data?.error;
      const backendMessage = error.response?.data?.message;
      
      return { 
        success: false, 
        message: backendError || backendMessage || 'Registration failed' 
      };
    }
  };

  const verifyOtp = async (email, otpCode) => {
    try {
      await AuthRepository.verifyOtp(email, otpCode);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updated = await AuthRepository.updateProfile(profileData);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, data: updated };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOtp, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
