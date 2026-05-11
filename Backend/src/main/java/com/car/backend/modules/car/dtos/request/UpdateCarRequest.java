
package com.car.backend.modules.car.dtos.request;

import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateCarRequest {	
	@NotBlank(message = "Tên xe không được để trống")
	@Size(max = 100)
	private String carName;
	
	@NotBlank
	@Size(max = 50)
	private String brand;
	
	@NotBlank
	@Size(max = 50)
	private String model;
	
	@Min(1900) @Max(2100)
	private int year;
	
	@NotBlank
	@Size(max = 20)
	private String licensePlate;
	
	@Size(max = 30)
	private String color;
	
	@Min(1) @Max(50)
	private int seats;
	
	private FuelType fuelType;
	
	private Transmission transmission;
	
	@Positive(message = "Giá thuê phải lớn hơn 0")
	private BigDecimal pricePerDay;
	
	private String description;
	
	private String thumbnailUrl;
}