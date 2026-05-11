import { VehicleRepository } from '../../data/repositories/VehicleRepository';

export const GetVehicleDetail = async (id) => {
  return await VehicleRepository.getVehicleById(id);
};
