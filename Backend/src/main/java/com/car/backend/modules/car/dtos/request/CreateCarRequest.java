package com.car.backend.modules.car.dtos.request;

import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateCarRequest {
	
	@NotBlank(message = "Tên xe không được để trống ")
	@Size(max= 100, message= "Tên xe tối đa 100 ký tự")
	private String carName;
	
	@NotBlank(message = "Hãng xe không được để trống ")
	@Size(max= 50, message= "Hãng xe tối đa 50 ký tự")
	private String brand;
	
	@NotBlank(message = "Model không được để trống ")
	@Size(max= 50, message= "Model tối đa 50 ký tự")
	private String model;
	
	@Min(value = 1900, message = " Năm sản xuất không hợp lệ")
	@Max(value = 2026, message = " Năm sản xuất không hợp lệ")
	private int year;
	
	@NotBlank(message = "Biển số không được để trống")
	@Size(max= 10)
	private String licensePlate;
	
	@Size(max = 30 )
	private String color;
	
	@Min(value=1, message = "Số ghế tối thiểu là 1")
	@Max(value = 50 ,message =  "Số ghế tối đa là 50 ")
	private int seats = 4;
	
	private FuelType fuelType = FuelType.GASOLINE;
	
	private Transmission transmission = Transmission.AUTOMATIC;
	
	@Positive(message = "Giá thuê phải lớn hơn 0")
	private BigDecimal pricePerDay;
	
	private String description;
	
	private String thumbnailUrl;
	
	
	
}
