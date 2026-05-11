package com.car.backend.modules.rental.entity;

import com.car.backend.modules.car.entity.Car;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "RentalDetail")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RentalDetail {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rentalDetailId")
	private Long rentalDetailId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rentalId", nullable = false)
	private Rental rental;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "carId", nullable = false)
	private Car car;
	
	@Column(name = "pricePerDay", nullable = false)
	private BigDecimal pricePerDay;
	
	@Column(name = "days", nullable = false)
	private int days;
	
	@Column(name = "subtotal", nullable = false)
	private BigDecimal subtotal;
}