package com.car.backend.modules.car.service.interfaces;

import com.car.backend.modules.car.dtos.request.CarFilterRequest;
import com.car.backend.modules.car.dtos.request.CreateCarRequest;
import com.car.backend.modules.car.dtos.request.UpdateCarRequest;
import com.car.backend.modules.car.dtos.response.CarDetailResponse;
import com.car.backend.modules.car.dtos.response.CarResponse;
import com.car.backend.modules.car.enums.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface CarService {
	
	CarDetailResponse getCarById(Long id);
	
	Page<CarResponse> getCars(CarFilterRequest request, Pageable pageable);
	
	Page<CarResponse> search(CarFilterRequest request, Pageable pageable);
	
	CarDetailResponse createCar(CreateCarRequest request);
	
	boolean isAvailable(Long carId, LocalDate startDate,  LocalDate endDate);
	
	CarDetailResponse updateCar(Long id, UpdateCarRequest updateCarRequest);
	
	void deleteCarById(Long id);
	
	CarDetailResponse updateStatus(Long id, CarStatus carStatus);
	
}