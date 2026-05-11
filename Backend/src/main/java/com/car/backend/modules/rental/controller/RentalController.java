package com.car.backend.modules.rental.controller;

import com.car.backend.common.anotations.CurrentUserId;
import com.car.backend.modules.rental.dtos.request.CancelRentalRequest;
import com.car.backend.modules.rental.dtos.request.CreateRentalRequest;
import com.car.backend.modules.rental.dtos.request.RentalFilterRequest;
import com.car.backend.modules.rental.dtos.response.RentalDetailResponse;
import com.car.backend.modules.rental.dtos.response.RentalResponse;
import com.car.backend.modules.rental.enums.RentalStatus;
import com.car.backend.modules.rental.service.interfaces.RentalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.car.backend.modules.rental.dtos.request.UpdateRentalStatusRequest;

@RestController
@RequestMapping("/api/v1/rentals")
@RequiredArgsConstructor
@Tag(name = "Rental Management", description = "APIs for creating and managing car rental bookings")
public class RentalController {
	
	private final RentalService rentalService;
	
	@PostMapping
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Create rental booking", description = "Create a new car rental booking (Customer only)")
	@ApiResponse(responseCode = "201", description = "Booking created successfully")
	@ApiResponse(responseCode = "409", description = "Date conflict or car unavailable")
	@ApiResponse(responseCode = "422", description = "Incomplete user profile")
	public ResponseEntity<RentalDetailResponse> create(
			@Valid @RequestBody CreateRentalRequest request,
			@CurrentUserId Long userId
	) {
		return ResponseEntity.status(201)
		                     .body(rentalService.createRental(request, userId));
	}
	
	@GetMapping("/my")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get my rentals", description = "Get a paginated list of current user's rentals")
	public ResponseEntity<Page<RentalResponse>> getMyRentals(
			@RequestParam(required = false) RentalStatus status,
			@PageableDefault(size = 10) Pageable pageable,
			@CurrentUserId Long userId
	) {
		return ResponseEntity.ok(
				rentalService.getMyRentals(userId, status, pageable));
	}
	
	@GetMapping("/my/{id}")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Get my rental detail", description = "Get detailed information of a specific rental belonging to the current user")
	public ResponseEntity<RentalDetailResponse> getMyDetail(
			@PathVariable Long id,
			@CurrentUserId Long userId
	) {
		return ResponseEntity.ok(
				rentalService.getMyRentalDetail(id, userId));
	}
	
	@DeleteMapping("/my/{id}")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Operation(summary = "Cancel my rental", description = "Cancel a pending rental booking (Customer only)")
	public ResponseEntity<RentalDetailResponse> cancelByCustomer(
			@PathVariable Long id,
			@Valid @RequestBody CancelRentalRequest request,
			@CurrentUserId Long userId
	) {
		return ResponseEntity.ok(
				rentalService.cancelByCustomer(id, userId, request));
	}
	
	@PutMapping("/{id}/cancel")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "Cancel rental by staff", description = "Cancel a rental booking by staff (Staff only)")
	public ResponseEntity<RentalDetailResponse> cancelByStaff(
			@PathVariable Long id,
			@Valid @RequestBody CancelRentalRequest request,
			@CurrentUserId Long staffId
	) {
		return ResponseEntity.ok(
				rentalService.cancelByStaff(id, staffId, request));
	}
	
	@GetMapping
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	@Operation(summary = "Get all rentals", description = "Get all rentals with filters and pagination (Staff/Admin only)")
	public ResponseEntity<Page<RentalResponse>> getAll(
			RentalFilterRequest filter,
			@PageableDefault(size = 10) Pageable pageable
	) {
		return ResponseEntity.ok(rentalService.getAllRentals(filter, pageable));
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	@Operation(summary = "Get rental detail", description = "Get detailed information of any rental (Staff/Admin only)")
	public ResponseEntity<RentalDetailResponse> getDetail(@PathVariable Long id) {
		return ResponseEntity.ok(rentalService.getRentalDetail(id));
	}
	
	@PutMapping("/{id}/confirm")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "Confirm rental", description = "Confirm a pending rental booking (Staff only)")
	public ResponseEntity<RentalDetailResponse> confirm(
			@PathVariable Long id,
			@CurrentUserId Long staffId
	) {
		return ResponseEntity.ok(rentalService.confirm(id, staffId));
	}
	
	@PutMapping("/{id}/start")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "Start rental", description = "Mark a rental as started when the car is handed over (Staff only)")
	public ResponseEntity<RentalDetailResponse> start(
			@PathVariable Long id,
			@CurrentUserId Long staffId
	) {
		return ResponseEntity.ok(rentalService.startRental(id, staffId));
	}
	
	@PutMapping("/{id}/complete")
	@PreAuthorize("hasRole('STAFF')")
	@Operation(summary = "Complete rental", description = "Mark a rental as completed when the car is returned (Staff only)")
	public ResponseEntity<RentalDetailResponse> complete(
			@PathVariable Long id,
			@CurrentUserId Long staffId
	) {
		return ResponseEntity.ok(rentalService.completeRental(id, staffId));
	}

	@GetMapping("/car/{carId}/booked-dates")
	@Operation(summary = "Get booked dates for a car", description = "Get a list of all dates where the car is already booked")
	public ResponseEntity<java.util.List<java.time.LocalDate>> getBookedDates(@PathVariable Long carId) {
		return ResponseEntity.ok(rentalService.getBookedDates(carId));
	}

        @PutMapping("/{id}/status")
        @PreAuthorize("hasRole('STAFF')")
        @Operation(summary = "Update rental status", description = "Update rental status using a unified endpoint (Staff only)")
        public ResponseEntity<RentalDetailResponse> updateStatus(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateRentalStatusRequest request,
                        @CurrentUserId Long staffId
        ) {
                return ResponseEntity.ok(rentalService.updateStatus(id, staffId, request));
        }
}
