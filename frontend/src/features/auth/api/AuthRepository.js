import api from '../../../infrastructure/api/axios.js';

export const AuthRepository = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  verifyOtp: async (email, otpCode) => {
    const response = await api.post('/auth/verify-otp', { email, otpCode });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/v1/user-info/me');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/v1/user-info/me', profileData);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/v1/files/upload-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  }
};
