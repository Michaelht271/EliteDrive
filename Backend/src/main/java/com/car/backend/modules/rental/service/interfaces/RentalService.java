package com.car.backend.modules.rental.service.interfaces;

import com.car.backend.modules.rental.dtos.request.CancelRentalRequest;
import com.car.backend.modules.rental.dtos.request.CreateRentalRequest;
import com.car.backend.modules.rental.dtos.request.RentalFilterRequest;
import com.car.backend.modules.rental.dtos.response.RentalDetailResponse;
import com.car.backend.modules.rental.dtos.response.RentalResponse;
import com.car.backend.modules.rental.enums.RentalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.car.backend.modules.rental.dtos.request.UpdateRentalStatusRequest;


public interface RentalService {
	

	RentalDetailResponse createRental(CreateRentalRequest request, Long customerId);
	
	Page<RentalResponse> getMyRentals(Long customerId, RentalStatus status, Pageable pageable);
	
	
	RentalDetailResponse getMyRentalDetail(Long rentalId, Long customerId);
	

	RentalDetailResponse cancelByCustomer(Long rentalId, Long customerId, CancelRentalRequest request);
	
	// ── Staff ────────────────────────────────────────────────
	/** Xem tất cả đơn */
	Page<RentalResponse> getAllRentals(RentalFilterRequest filter, Pageable pageable);
	
	/** Xem chi tiết bất kỳ đơn nào */
	RentalDetailResponse getRentalDetail(Long rentalId);
	
	/** Confirm booking: PENDING → CONFIRMED */
	RentalDetailResponse confirm(Long rentalId, Long staffId);
	
	/** Giao xe: CONFIRMED → RENTING */
	RentalDetailResponse startRental(Long rentalId, Long staffId);
	
	/** Nhận xe trả: RENTING → COMPLETED */
	RentalDetailResponse completeRental(Long rentalId, Long staffId);
	
	/** Hủy đơn từ phía Staff */
	RentalDetailResponse cancelByStaff(Long rentalId, Long staffId, CancelRentalRequest request);

	java.util.List<java.time.LocalDate> getBookedDates(Long carId);

        RentalDetailResponse updateStatus(Long rentalId, Long staffId, UpdateRentalStatusRequest request);
}