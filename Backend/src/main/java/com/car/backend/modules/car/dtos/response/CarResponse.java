
package com.car.backend.modules.car.dtos.response;

import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarResponse {
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
	private String       thumbnailUrl;
}