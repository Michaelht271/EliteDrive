package com.car.backend.modules.rental.dtos.response;

import com.car.backend.modules.rental.enums.RentalStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// RentalDetailResponse.java  — chi tiết 1 đơn
@Data
public class RentalDetailResponse {
	private Long              rentalId;
	
	// Customer info
	private Long              customerId;
	private String            customerName;
	private String            customerEmail;
	private String            customerPhone;
	
	// Staff info (nullable khi PENDING)
	private Long              staffId;
	private String            staffName;
	
	private LocalDate startDate;
	private LocalDate         endDate;
	private LocalDateTime actualStartDate;
	private LocalDateTime     actualEndDate;
	private BigDecimal totalPrice;
	private RentalStatus status;
	private String            cancelReason;
	private String            notes;
	private LocalDateTime     createdAt;
	private LocalDateTime     updatedAt;
	
	// Chi tiết từng xe trong đơn
	private List<RentalItemResponse> items;
}