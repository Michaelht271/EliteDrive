package com.car.backend.modules.rental.dtos.request;

import com.car.backend.modules.rental.enums.RentalStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

// RentalFilterRequest.java  — dùng cho Staff/Admin xem danh sách
@Data
public class RentalFilterRequest {
	private RentalStatus status;
	private String       keyword;   // tìm theo tên / email customer
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate from;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate    to;
}