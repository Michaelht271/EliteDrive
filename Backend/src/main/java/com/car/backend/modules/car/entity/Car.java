package com.car.backend.modules.car.entity;

import com.car.backend.base.BaseEntity;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Cars")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Car extends BaseEntity {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CarId")
	private Long carId;
	
	@Column(name = "CarName", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
	private String carName;
	
	@Column(name = "Brand", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
	private String brand;
	
	@Column(name = "Model", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
	private String model;
	
	@Column(name = "Year", nullable = false)
	private int year;
	
	@Column(name = "LicensePlate", nullable = false, unique = true, length = 20)
	private String licensePlate;
	
	@Column(name = "Color", length = 30, columnDefinition = "NVARCHAR(30)")
	private String color;
	
	@Builder.Default
	@Column(name = "Seats")
	private int seats = 4;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "FuelType", length = 20)
	private FuelType fuelType = FuelType.GASOLINE;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "Transmission", length = 20)
	private Transmission transmission = Transmission.AUTOMATIC;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private CarStatus carStatus = CarStatus.AVAILABLE;
	
	@Column(name = "price_per_day", nullable = false, precision = 12, scale = 2)
	private BigDecimal pricePerDay;
	
	@Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
	private String description;
	
	@Column(name = "thumbnail_url", length = 500)
	private String thumbnailUrl;
	
	@Builder.Default
	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;
	
	@Override
	public Long getID() {
		return carId;
	}
}