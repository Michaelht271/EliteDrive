package com.car.backend.modules.rental.repository;

import com.car.backend.modules.rental.entity.Rental;
import com.car.backend.modules.rental.enums.RentalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ══════════════════════════════════════════════════════════════
// REPOSITORY
// ══════════════════════════════════════════════════════════════
@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
	
	// Customer xem đơn của mình, có lọc status nếu cần
	@Query("""
        SELECT r FROM Rental r
        WHERE r.customer.userId = :customerId
          AND (:status IS NULL OR r.status = :status)
        ORDER BY r.createdDate DESC
    """)
	Page<Rental> findByCustomerWithFilters(
			@Param("customerId") Long customerId, 
			@Param("status") RentalStatus status, 
			Pageable pageable);

	
	// Staff/Admin xem tất cả, filter động
	@Query("""
        SELECT r FROM Rental r
        WHERE (:status  IS NULL OR r.status = :status)
          AND (:from    IS NULL OR r.startDate >= :from)
          AND (:to      IS NULL OR r.endDate   <= :to)
          AND (:keyword IS NULL
               OR LOWER(r.customer.username) LIKE LOWER(CONCAT('%',:keyword,'%'))
               OR LOWER(r.customer.email)    LIKE LOWER(CONCAT('%',:keyword,'%')))
        ORDER BY r.createdDate DESC
    """)
	Page<Rental> findAllWithFilter(
			@Param("status") RentalStatus status,
			@Param("from") LocalDate from,
			@Param("to")      LocalDate to,
			@Param("keyword") String keyword,
			Pageable pageable
	);
	
	// Check double-booking (dùng trong CarAvailabilityService)
	@Query("""
        SELECT COUNT(rd) FROM RentalDetail rd
        JOIN rd.rental r
        WHERE rd.car.carId = :carId
          AND r.status NOT IN ('CANCELLED')
          AND r.startDate < :endDate
          AND r.endDate   > :startDate
    """)
	long countConflictingRentals(
			@Param("carId")     Long carId,
			@Param("startDate") LocalDate startDate,
			@Param("endDate")   LocalDate endDate
	);
	
	// Check xe có đang trong đơn active không (dùng khi delete xe)
	boolean existsByRentalDetails_Car_CarIdAndStatusIn(Long carId, List<RentalStatus> statuses);
	
	// Cancel toàn bộ PENDING khi xe bị xóa
	@Modifying
	@Query("""
        UPDATE Rental r SET r.status = 'CANCELLED', r.cancelReason = :reason
        WHERE r.status = 'PENDING'
          AND EXISTS (
              SELECT rd FROM RentalDetail rd
              WHERE rd.rental = r AND rd.car.carId = :carId
          )
    """)
	void cancelPendingByCarId(@Param("carId") Long carId, @Param("reason") String reason);

	// Lấy danh sách đơn hàng active của 1 xe để block ngày trên lịch
	@Query("""
        SELECT r FROM Rental r
        JOIN r.rentalDetails rd
        WHERE rd.car.carId = :carId
          AND r.status NOT IN ('CANCELLED')
          AND r.endDate >= CURRENT_DATE
    """)
	List<Rental> findActiveRentalsByCarId(@Param("carId") Long carId);
}
