import api from '../../infrastructure/api/axios';

export const UserRepository = {
  /**
   * Lấy danh sách tất cả người dùng (Chỉ Admin)
   */
  getUsers: async () => {
    const response = await api.get('/v1/users');
    return response.data;
  },

  /**
   * Tạo người dùng mới (Chỉ Admin)
   */
  createUser: async (userData) => {
    const response = await api.post('/v1/users', userData);
    return response.data;
  },

  /**
   * Khóa tài khoản người dùng
   */
  disableUser: async (id) => {
    const response = await api.put(`/v1/users/${id}/disable`);
    return response.data;
  },

  /**
   * Mở khóa tài khoản người dùng
   */
  enableUser: async (id) => {
    const response = await api.put(`/v1/users/${id}/enable`);
    return response.data;
  },

  /**
   * Xóa người dùng (Vĩnh viễn)
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/v1/users/${id}`);
    return response.data;
  }
};
