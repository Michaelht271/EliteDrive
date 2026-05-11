package com.car.backend.modules.rental.repository;

import com.car.backend.modules.rental.entity.RentalDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalDetailRepository extends JpaRepository<RentalDetail, Long> {
}
