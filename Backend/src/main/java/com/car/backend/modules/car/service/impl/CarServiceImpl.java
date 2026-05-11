package com.car.backend.modules.car.service.impl;

import com.car.backend.exception.custom.bussiness.ResourceNotFoundException;
import com.car.backend.modules.car.dtos.CarMapper;
import com.car.backend.modules.car.dtos.request.CarFilterRequest;
import com.car.backend.modules.car.dtos.request.CreateCarRequest;
import com.car.backend.modules.car.dtos.request.UpdateCarRequest;
import com.car.backend.modules.car.dtos.response.CarDetailResponse;
import com.car.backend.modules.car.dtos.response.CarResponse;
import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.exception.ConflictException;
import com.car.backend.modules.car.repository.CarRepository;
import com.car.backend.modules.car.repository.CarSpecification;
import com.car.backend.modules.car.service.interfaces.CarService;

import com.car.backend.modules.rental.enums.RentalStatus;
import com.car.backend.modules.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarServiceImpl implements CarService {
	private final CarRepository carRepository;
	private final RentalRepository rentalRepository;
	private final CarMapper carMapper;
	
	
	@Override
	@Transactional(readOnly = true)
	public CarDetailResponse getCarById(Long id) {
		return carMapper.toDetailResponse(getActiveCarOrThrow(id));
	}
	

	@Override
	@Transactional(readOnly = true)
	public Page<CarResponse> getCars(CarFilterRequest request, Pageable pageable) {
		return search(request, pageable);
	}
	@Override
	@Transactional(readOnly = true)
	public Page<CarResponse> search(CarFilterRequest request, Pageable pageable) {
		return carRepository.findAll(
				CarSpecification.filterCars(
						request.getKeyword(),
						request.getBrand(),
						request.getStatus(),
						request.getSeats(),
						request.getMinPrice(),
						request.getMaxPrice(),
						request.getStartDate(),
						request.getEndDate()
				),
				pageable
		).map(carMapper::toResponse);
	}
	
	@Override
	@Transactional(readOnly = true)
	public CarDetailResponse createCar(CreateCarRequest request) {
		if(carRepository.existsByLicensePlate(request.getLicensePlate())) {
			throw new ConflictException("Biển số đã tồn tại: " + request.getLicensePlate());
		}
		
		Car car = carMapper.toEntity(request);
		return carMapper.toDetailResponse(carRepository.save(car));
	}
	@Override
	@Transactional(readOnly = true)
	public boolean isAvailable(Long carId, LocalDate startDate, LocalDate endDate) {
		if (endDate.isBefore(startDate)) {
			throw new IllegalArgumentException("Ngày kết thúc không thể trước ngày bắt đầu");
		}
		return carRepository.countConflictingRentals(carId, startDate, endDate) == 0;
	}
	@Override
	@Transactional
	public CarDetailResponse updateCar(Long id, UpdateCarRequest updateCarRequest) {
		Car car = getActiveCarOrThrow(id);
		
		if(!car.getLicensePlate().equals(updateCarRequest.getLicensePlate())
		&& carRepository.existsByLicensePlate(updateCarRequest.getLicensePlate())) {
			throw new ConflictException("Biển số đã tồn tại: " + updateCarRequest.getLicensePlate());
		}
		
		carMapper.updateEntity(updateCarRequest, car);
		return carMapper.toDetailResponse(carRepository.save(car));
	}

	@Override
	@Transactional
	public void deleteCarById(Long id) {
		Car car = getActiveCarOrThrow(id);

		// Kiểm tra xe có đơn thuê nào đang hoạt động không (PENDING, CONFIRMED, RENTING)
		boolean hasActiveRental = rentalRepository.existsByRentalDetails_Car_CarIdAndStatusIn(
				id,
				List.of(RentalStatus.PENDING, RentalStatus.CONFIRMED, RentalStatus.RENTING)
		);

		if (hasActiveRental) {
			throw new ConflictException("Không thể xóa xe đang có đơn thuê đang xử lý hoặc đang thuê");
		}

		car.setDeleted(true);
		carRepository.save(car);
		log.info("Soft deleted car id={}", id);
	}
	
	
	
	@Override
	@Transactional
	public CarDetailResponse updateStatus(Long id, CarStatus status) {
		Car car = getActiveCarOrThrow(id);
		car.setCarStatus(status);
		return carMapper.toDetailResponse(carRepository.save(car));
	}
	
	private Car getActiveCarOrThrow(Long id) {
		return carRepository.findByCarIdAndDeletedIsFalse(id)
		                    .orElseThrow(()-> new ResourceNotFoundException("Xe không tồn tại: " + id));
	}
}
