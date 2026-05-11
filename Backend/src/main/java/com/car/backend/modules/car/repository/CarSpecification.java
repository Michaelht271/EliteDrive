package com.car.backend.modules.car.repository;

import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.rental.entity.Rental;
import com.car.backend.modules.rental.entity.RentalDetail;
import com.car.backend.modules.rental.enums.RentalStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CarSpecification {

    public static Specification<Car> filterCars(
            String keyword,
            String brand,
            CarStatus status,
            Integer seats,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDate startDate,
            LocalDate endDate
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter out deleted cars
            predicates.add(cb.equal(root.get("deleted"), false));

            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.equal(root.get("brand"), brand));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("carStatus"), status));
            }

            if (seats != null) {
                predicates.add(cb.equal(root.get("seats"), seats));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerDay"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerDay"), maxPrice));
            }

            if (keyword != null && !keyword.isEmpty()) {
                String likeKeyword = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("carName")), likeKeyword),
                        cb.like(cb.lower(root.get("model")), likeKeyword)
                ));
            }

            if (startDate != null && endDate != null) {
                // Subquery to find cars that have conflicting rentals
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<RentalDetail> rdRoot = subquery.from(RentalDetail.class);
                Join<RentalDetail, Rental> rJoin = rdRoot.join("rental");
                
                subquery.select(rdRoot.get("car").get("carId"))
                        .where(
                            cb.and(
                                cb.notEqual(rJoin.get("status"), RentalStatus.CANCELLED),
                                cb.lessThan(rJoin.get("startDate"), endDate),
                                cb.greaterThan(rJoin.get("endDate"), startDate)
                            )
                        );

                predicates.add(cb.not(root.get("carId").in(subquery)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
