import { RentalRepository } from '../../data/repositories/RentalRepository';

export const CreateRental = async (carId, startDate, endDate, notes = '') => {
  if (!carId || !startDate || !endDate) {
    throw new Error('Vui lòng cung cấp đầy đủ thông tin đặt xe.');
  }

  const rentalData = {
    carId: Number(carId), // Đảm bảo là kiểu số
    startDate,
    endDate,
    notes
  };

  return await RentalRepository.createRental(rentalData);
};
