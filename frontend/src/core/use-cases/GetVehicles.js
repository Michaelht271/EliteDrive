import { VehicleRepository } from '../../data/repositories/VehicleRepository';

export const GetVehicles = async (filters = {}, pageable = { page: 0, size: 10, sort: 'pricePerDay,asc' }) => {
  return await VehicleRepository.getVehicles(filters, pageable);
};
