package com.car.backend.modules.rental.service.impl;

import com.car.backend.exception.custom.bussiness.ResourceNotFoundException;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.repository.UserRepository;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.exception.ConflictException;
import com.car.backend.modules.car.repository.CarRepository;
import com.car.backend.modules.rental.dtos.RentalMapper;
import com.car.backend.modules.rental.dtos.request.CancelRentalRequest;
import com.car.backend.modules.rental.dtos.request.CreateRentalRequest;
import com.car.backend.modules.rental.dtos.request.RentalFilterRequest;
import com.car.backend.modules.rental.dtos.response.RentalDetailResponse;
import com.car.backend.modules.rental.dtos.response.RentalResponse;
import com.car.backend.modules.rental.entity.Rental;
import com.car.backend.modules.rental.entity.RentalDetail;
import com.car.backend.modules.rental.enums.RentalStatus;
import com.car.backend.modules.rental.repository.RentalRepository;
import com.car.backend.modules.rental.service.interfaces.RentalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.car.backend.modules.rental.dtos.request.UpdateRentalStatusRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentalServiceImpl implements RentalService {
	
	private final RentalRepository rentalRepository;
	private final CarRepository    carRepository;
	private final UserRepository   userRepository;
	private final RentalMapper     rentalMapper;
	private final UserInformationService userInformationService;
	
	@Override
	@Transactional
	public RentalDetailResponse createRental(CreateRentalRequest request, Long customerId) {
		userInformationService.validateForRental(customerId);
	
		Car car = carRepository.findById(request.getCarId())
		                       .orElseThrow(() -> new ResourceNotFoundException("Xe không tồn tại"));
		
		if (car.getCarStatus() != CarStatus.AVAILABLE) {
			throw new ConflictException("Xe hiện không sẵn sàng để thuê");
		}
		
		long conflicts = rentalRepository.countConflictingRentals(
				request.getCarId(), request.getStartDate(), request.getEndDate());
		if (conflicts > 0) {
			throw new ConflictException("Xe đã được đặt trong khoảng thời gian này");
		}
		
		// 4. Tính giá
		int days = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
		if (days <= 0) days = 1;
		
		BigDecimal priceSnapshot = car.getPricePerDay();
		BigDecimal subtotal      = priceSnapshot.multiply(BigDecimal.valueOf(days));
		
		// 5. Load customer
		User customer = userRepository.findById(customerId)
		                              .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
		
		// 6. Create Rental
		Rental rental = Rental.builder()
		                      .customer(customer)
		                      .startDate(request.getStartDate())
		                      .endDate(request.getEndDate())
		                      .totalPrice(subtotal)
		                      .status(RentalStatus.PENDING)
		                      .notes(request.getNotes())
		                      .build();
		
		// 7. Detail
		RentalDetail detail = RentalDetail.builder()
		                                  .rental(rental)
		                                  .car(car)
		                                  .pricePerDay(car.getPricePerDay())
		                                  .subtotal(priceSnapshot)
		                                  .build();
		rental.getRentalDetails().add(detail);
		
		Rental saved = rentalRepository.save(rental);
		log.info("Created booking rentalId={} customerId={}", saved.getRentalId(), customerId);
		return rentalMapper.toDetailResponse(saved);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Page<RentalResponse> getMyRentals(Long customerId, RentalStatus status, Pageable pageable) {
		return rentalRepository
				.findByCustomerWithFilters(customerId, status, pageable)
				.map(rentalMapper::toResponse);
	}
	
	@Override
	@Transactional(readOnly = true)
	public RentalDetailResponse getMyRentalDetail(Long rentalId, Long customerId) {
		Rental rental = getRentalOrThrow(rentalId);
		if (!rental.getCustomer().getUserId().equals(customerId)) {
			throw new ConflictException("Bạn không có quyền xem đơn này");
		}
		return rentalMapper.toDetailResponse(rental);
	}
	
	@Override
	@Transactional
	public RentalDetailResponse cancelByCustomer(Long rentalId, Long customerId, CancelRentalRequest request) {
		Rental rental = getRentalOrThrow(rentalId);
		if (!rental.getCustomer().getUserId().equals(customerId)) {
			throw new ConflictException("Bạn không có quyền hủy đơn này");
		}
		if (rental.getStatus() != RentalStatus.PENDING) {
			throw new ConflictException("Chỉ có thể hủy đơn khi đang chờ xác nhận");
		}
		rental.setStatus(RentalStatus.CANCELLED);
		rental.setCancelReason(request.getCancelReason());
		return rentalMapper.toDetailResponse(rentalRepository.save(rental));
	}
	
	@Override
	@Transactional(readOnly = true)
	public Page<RentalResponse> getAllRentals(RentalFilterRequest filter, Pageable pageable) {
		return rentalRepository.findAllWithFilter(
				filter.getStatus(),
				filter.getFrom(),
				filter.getTo(),
				filter.getKeyword(),
				pageable
		).map(rentalMapper::toResponse);
	}
	
	@Override
	@Transactional(readOnly = true)
	public RentalDetailResponse getRentalDetail(Long rentalId) {
		return rentalMapper.toDetailResponse(getRentalOrThrow(rentalId));
	}
	
	@Override
	@Transactional
	public RentalDetailResponse confirm(Long rentalId, Long staffId) {
		Rental rental = getRentalOrThrow(rentalId);
		User staff = getUserOrThrow(staffId);
		
		if (rental.getStatus() != RentalStatus.PENDING) {
			throw new ConflictException("Trạng thái đơn không hợp lệ để xác nhận");
		}
		
		rental.setStatus(RentalStatus.CONFIRMED);
		rental.setStaff(staff);
		return rentalMapper.toDetailResponse(rentalRepository.save(rental));
	}
	
	@Override
	@Transactional
	public RentalDetailResponse startRental(Long rentalId, Long staffId) {
		Rental rental = getRentalOrThrow(rentalId);
		if (rental.getStatus() != RentalStatus.CONFIRMED) {
			throw new ConflictException("Phải xác nhận đơn trước khi giao xe");
		}
		rental.setStatus(RentalStatus.RENTING);
		rental.setActualStartDate(LocalDateTime.now());
		return rentalMapper.toDetailResponse(rentalRepository.save(rental));
	}
	
	@Override
	@Transactional
	public RentalDetailResponse completeRental(Long rentalId, Long staffId) {
		Rental rental = getRentalOrThrow(rentalId);
		if (rental.getStatus() != RentalStatus.RENTING) {
			throw new ConflictException("Đơn phải ở trạng thái đang thuê mới có thể hoàn thành");
		}
		rental.setStatus(RentalStatus.COMPLETED);
		rental.setActualEndDate(LocalDateTime.now());
		return rentalMapper.toDetailResponse(rentalRepository.save(rental));
	}
	
	@Override
	@Transactional
	public RentalDetailResponse cancelByStaff(Long rentalId, Long staffId, CancelRentalRequest request) {
		Rental rental = getRentalOrThrow(rentalId);
		User staff = getUserOrThrow(staffId);
		
		rental.setStatus(RentalStatus.CANCELLED);
		rental.setStaff(staff);
		rental.setCancelReason(request.getCancelReason());
		return rentalMapper.toDetailResponse(rentalRepository.save(rental));
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<LocalDate> getBookedDates(Long carId) {
		List<Rental> rentals = rentalRepository.findActiveRentalsByCarId(carId);
		Set<LocalDate> bookedDates = new HashSet<>();
		
		for (Rental r : rentals) {
			LocalDate current = r.getStartDate();
			while (!current.isAfter(r.getEndDate())) {
				bookedDates.add(current);
				current = current.plusDays(1);
			}
		}
		
		return bookedDates.stream().sorted().toList();
	}
	
	private Rental getRentalOrThrow(Long rentalId) {
		return rentalRepository.findById(rentalId)
		                       .orElseThrow(() -> new ResourceNotFoundException("Đơn thuê không tồn tại"));
	}
	
	private User getUserOrThrow(Long id) {
		return userRepository.findById(id)
		                     .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại: " + id));
	}

        
        @Override
        @Transactional
        public RentalDetailResponse updateStatus(Long rentalId, Long staffId, UpdateRentalStatusRequest request) {
                Rental rental = getRentalOrThrow(rentalId);
                User staff = getUserOrThrow(staffId);
                RentalStatus newStatus = request.getStatus();

                log.info("Updating rental {} status to {} by staff {}", rentalId, newStatus, staffId);

                switch (newStatus) {
                        case CONFIRMED -> {
                                if (rental.getStatus() != RentalStatus.PENDING) {
                                        throw new ConflictException("Chỉ có thể xác nhận đơn đang ở trạng thái PENDING");
                                }
                                rental.setStatus(RentalStatus.CONFIRMED);
                                rental.setStaff(staff);
                        }
                        case RENTING -> {
                                if (rental.getStatus() != RentalStatus.CONFIRMED) {
                                        throw new ConflictException("Chỉ có thể giao xe khi đơn đã được CONFIRMED");
                                }
                                rental.setStatus(RentalStatus.RENTING);
                                rental.setActualStartDate(LocalDateTime.now());
                                // Cập nhật trạng thái xe sang UNAVAILABLE
                                rental.getRentalDetails().forEach(detail -> {
                                        Car car = detail.getCar();
                                        car.setCarStatus(CarStatus.UNAVAILABLE);
                                        carRepository.save(car);
                                });
                        }
                        case COMPLETED -> {
                                if (rental.getStatus() != RentalStatus.RENTING) {
                                        throw new ConflictException("Chỉ có thể hoàn thành khi xe đang ở trạng thái RENTING");
                                }
                                rental.setStatus(RentalStatus.COMPLETED);
                                rental.setActualEndDate(LocalDateTime.now());
                                // Trả trạng thái xe về AVAILABLE
                                rental.getRentalDetails().forEach(detail -> {
                                        Car car = detail.getCar();
                                        car.setCarStatus(CarStatus.AVAILABLE);
                                        carRepository.save(car);
                                });
                        }
                        case CANCELLED -> {
                                rental.setStatus(RentalStatus.CANCELLED);
                                rental.setStaff(staff);
                                rental.setCancelReason(request.getCancelReason());
                                // Trả trạng thái xe về AVAILABLE nếu đang ở trạng thái bị chiếm dụng
                                if (rental.getStatus() == RentalStatus.RENTING) {
                                        rental.getRentalDetails().forEach(detail -> {
                                                Car car = detail.getCar();
                                                car.setCarStatus(CarStatus.AVAILABLE);
                                                carRepository.save(car);
                                        });
                                }
                        }
                        default -> throw new ConflictException("Trạng thái mới không hợp lệ");
                }

                return rentalMapper.toDetailResponse(rentalRepository.save(rental));
        }
}