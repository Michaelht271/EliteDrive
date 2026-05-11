import api from '../../infrastructure/api/axios';

export const RentalRepository = {
  /**
   * Tạo đơn đặt xe mới
   */
  createRental: async (rentalData) => {
    const response = await api.post('/v1/rentals', rentalData);
    return response.data;
  },

  /**
   * Lấy danh sách đơn đặt xe của tôi (Customer)
   */
  getMyRentals: async (params) => {
    const response = await api.get('/v1/rentals/my', { params });
    return response.data;
  },

  /**
   * Lấy chi tiết đơn đặt xe
   */
  getRentalDetail: async (id) => {
    const response = await api.get(`/v1/rentals/my/${id}`);
    return response.data;
  },

  /**
   * Khách hàng hủy đơn (Chỉ khi PENDING)
   */
  cancelRental: async (id, cancelReason = 'Khách hàng yêu cầu hủy') => {
    // API yêu cầu Body chứa lý do hủy với field name là cancelReason
    const response = await api.delete(`/v1/rentals/my/${id}`, {
      data: { cancelReason }
    });
    return response.data;
  },

  /**
   * Lấy danh sách ngày bận của xe
   */
  getBookedDates: async (carId) => {
    const response = await api.get(`/v1/rentals/car/${carId}/booked-dates`);
    return response.data; // Mảng ['YYYY-MM-DD', ...]
  },

  /**
   * Dành cho Staff/Admin: Lấy tất cả các đơn đặt xe
   */
  getAllRentals: async (params) => {
    const response = await api.get('/v1/rentals', { params });
    return response.data;
  },

  /**
   * Dành cho Staff/Admin: Lấy chi tiết đơn đặt xe
   */
  getStaffRentalDetail: async (id) => {
    const response = await api.get(`/v1/rentals/${id}`);
    return response.data;
  },

  /**
   * Dành cho Staff/Admin: Cập nhật trạng thái đơn đặt xe
   */
  updateRentalStatus: async (rentalId, status, data = {}) => {
    // Chỉ gửi status trong Body để khớp với @RequestBody UpdateRentalStatusRequest của Backend
    const response = await api.put(`/v1/rentals/${rentalId}/status`, { status, ...data });
    return response.data;
  }
};
