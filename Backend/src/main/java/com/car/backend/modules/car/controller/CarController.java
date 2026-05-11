package com.car.backend.modules.car.controller;

import com.car.backend.modules.car.dtos.request.CarFilterRequest;
import com.car.backend.modules.car.dtos.request.CreateCarRequest;
import com.car.backend.modules.car.dtos.request.UpdateCarRequest;
import com.car.backend.modules.car.dtos.response.CarDetailResponse;
import com.car.backend.modules.car.dtos.response.CarResponse;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.service.interfaces.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor
@Tag(name = "Car Management", description = "APIs for managing cars and checking availability")
public class CarController {
	
	private final CarService carService;
	
	@GetMapping
	@Operation(summary = "Search cars", description = "Search cars with filters and pagination")
	public ResponseEntity<Page<CarResponse>> search(
			CarFilterRequest carFilterRequest,
			@PageableDefault(size = 10, sort = "pricePerDay", direction = Sort.Direction.ASC)
			Pageable pageable) {
		
		return ResponseEntity.ok(carService.search(carFilterRequest, pageable));
	}
	
	@GetMapping("/{id}")
	@Operation(summary = "Get car detail", description = "Get detailed information of a specific car by ID")
	@ApiResponse(responseCode = "200", description = "Car details found")
	@ApiResponse(responseCode = "404", description = "Car not found")
	public ResponseEntity<CarDetailResponse> getCar(@PathVariable Long id) {
		return ResponseEntity.ok(carService.getCarById(id));
	}
	
	@GetMapping("/{id}/availability")
	@Operation(summary = "Check car availability", description = "Check if a car is available for a specific date range")
	public ResponseEntity<Boolean> checkAvailability(
			@PathVariable Long id,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
	) {
		return ResponseEntity.ok(carService.isAvailable(id, startDate, endDate));
	}
	
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Create new car", description = "Create a new car entry (Admin only)")
	@ApiResponse(responseCode = "201", description = "Car created successfully")
	@ApiResponse(responseCode = "409", description = "License plate already exists")
	public ResponseEntity<CarDetailResponse> create(
			@Valid @RequestBody CreateCarRequest request
	) {
		return ResponseEntity.status(201).body(carService.createCar(request));
	}
	
	
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Update car", description = "Update existing car information (Admin only)")
	public ResponseEntity<CarDetailResponse> update(
			@PathVariable Long id,
			@Valid @RequestBody UpdateCarRequest request
	) {
		return ResponseEntity.ok(carService.updateCar(id, request));
	}
	
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Delete car", description = "Soft delete a car by ID (Admin only)")
	@ApiResponse(responseCode = "204", description = "Car deleted successfully")
	@ApiResponse(responseCode = "409", description = "Cannot delete car with active rentals")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		carService.deleteCarById(id);
		return ResponseEntity.noContent().build(); // 204
	}
	
	@PatchMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	@Operation(summary = "Update car status", description = "Update the status of a car (Admin only)")
	public ResponseEntity<CarDetailResponse> updateStatus(
			@PathVariable Long id,
			@RequestParam CarStatus status
	) {
		return ResponseEntity.ok(carService.updateStatus(id, status));
	}
}
