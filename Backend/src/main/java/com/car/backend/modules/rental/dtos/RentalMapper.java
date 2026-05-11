package com.car.backend.modules.rental.dtos;

import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.rental.dtos.response.RentalDetailResponse;
import com.car.backend.modules.rental.dtos.response.RentalResponse;
import com.car.backend.modules.rental.entity.Rental;
import org.mapstruct.*;

@Mapper(
		componentModel = "spring",
		uses = { RentalDetailMapper.class },
		builder = @Builder(disableBuilder = true)
)
public interface RentalMapper {
	
	// ── List view ─────────────────────────────────────────────
	@Mapping(target = "customerName",  source = "customer.userInformation.fullName")
	@Mapping(target = "customerEmail", source = "customer.email")
	@Mapping(target = "carId", ignore = true)
	@Mapping(target = "carName", ignore = true)
	@Mapping(target = "brand", ignore = true)
	@Mapping(target = "thumbnailUrl", ignore = true)
	@Mapping(target = "seats", ignore = true)
	@Mapping(target = "transmission", ignore = true)
	RentalResponse toResponse(Rental rental);

	@AfterMapping
	default void mapCarInfo(Rental rental, @MappingTarget RentalResponse response) {
		if (rental.getRentalDetails() != null && !rental.getRentalDetails().isEmpty()) {
			Car car = rental.getRentalDetails().get(0).getCar();
			if (car != null) {
				response.setCarId(car.getCarId());
				response.setCarName(car.getCarName());
				response.setBrand(car.getBrand());
				response.setThumbnailUrl(car.getThumbnailUrl());
				response.setSeats(car.getSeats());
				response.setTransmission(car.getTransmission() != null ? car.getTransmission().name() : null);
			}
		}
	}
	
	// ── Detail view ───────────────────────────────────────────
	@Mapping(target = "customerId",    source = "customer.userId")
	@Mapping(target = "customerName",  source = "customer.userInformation.fullName")
	@Mapping(target = "customerEmail", source = "customer.email")
	@Mapping(target = "customerPhone", source = "customer.phoneNumber")
	@Mapping(target = "staffId",       source = "staff.userId")
	@Mapping(target = "staffName",     source = "staff.userInformation.fullName")
	@Mapping(target = "items",         source = "rentalDetails")  // delegate to RentalDetailMapper
	@Mapping(target = "createdAt",     source = "createdDate")
	@Mapping(target = "updatedAt",     source = "lastModifiedDate")
	RentalDetailResponse toDetailResponse(Rental rental);
}
