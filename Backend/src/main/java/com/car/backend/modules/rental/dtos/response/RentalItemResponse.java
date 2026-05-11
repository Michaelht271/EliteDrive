package com.car.backend.modules.rental.dtos.response;

import lombok.Data;

import java.math.BigDecimal;

// RentalItemResponse.java  — 1 dòng trong rental_details
@Data
public class RentalItemResponse {
	private Long       carId;
	private String     carName;
	private String     brand;
	private String     licensePlate;
	private String     thumbnailUrl;
	private BigDecimal pricePerDay;   // snapshot lúc đặt
	private int        days;
	private BigDecimal subtotal;
}