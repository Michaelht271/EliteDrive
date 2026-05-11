package com.car.backend.modules.car.dtos.response;

import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CarDetailResponse {
	private Long         carId;
	private String       carName;
	private String       brand;
	private String       model;
	private int          year;
	private String       licensePlate;
	private String       color;
	private int          seats;
	private FuelType     fuelType;
	private Transmission transmission;
	private CarStatus    carStatus;
	private BigDecimal   pricePerDay;
	private String       description;
	private String       thumbnailUrl;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}