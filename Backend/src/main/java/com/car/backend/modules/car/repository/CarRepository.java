package com.car.backend.modules.car.repository;

import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
	Optional<Car> findByCarIdAndDeletedIsFalse(Long id);
	boolean existsByLicensePlate(String licensePlate);
	// Kiểm tra double-booking
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
	
	@Query("""
    SELECT c FROM Car c
    WHERE c.deleted = false
      AND (:brand     IS NULL OR c.brand      = :brand)
      AND (:status    IS NULL OR c.carStatus  = :status)
      AND (:seats     IS NULL OR c.seats      = :seats)
      AND (:minPrice  IS NULL OR c.pricePerDay >= :minPrice)
      AND (:maxPrice  IS NULL OR c.pricePerDay <= :maxPrice)
      AND (:keyword   IS NULL
           OR LOWER(c.carName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(c.model)   LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND (
        :startDate IS NULL
        OR :endDate IS NULL
        OR NOT EXISTS (
            SELECT rd FROM RentalDetail rd
            JOIN rd.rental r
            WHERE rd.car.carId = c.carId
              AND r.status NOT IN ('CANCELLED')
              AND r.startDate < :endDate
              AND r.endDate   > :startDate
        )
      )
""")
	Page<Car> search(
			@Param("keyword")   String keyword,
			@Param("brand")     String brand,
			@Param("status")    CarStatus status,
			@Param("seats")     Integer seats,
			@Param("minPrice")  BigDecimal minPrice,
			@Param("maxPrice")  BigDecimal maxPrice,
			@Param("startDate") LocalDate startDate,
			@Param("endDate")   LocalDate endDate,
			Pageable pageable);
}
