import api from '../../infrastructure/api/axios';

export const VehicleRepository = {
  getVehicles: async (filters, pageable) => {
    const params = {
      ...filters,
      page: pageable.page,
      size: pageable.size
    };

    // If sort is 'pricePerDay,asc', we send it as an array to ensure axios handles it correctly
    // or as a comma-separated string if that's what Spring expects.
    // Let's use the standard Spring Data format.
    if (pageable.sort) {
      params.sort = pageable.sort;
    }

    const response = await api.get('/v1/cars', { params });
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await api.get(`/v1/cars/${id}`);
    return response.data;
  },

  checkAvailability: async (id, startDate, endDate) => {
    const response = await api.get(`/v1/cars/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/v1/cars', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/v1/cars/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/v1/cars/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/v1/cars/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
