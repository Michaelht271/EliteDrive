package com.car.backend.modules.rental.dtos;

import com.car.backend.modules.rental.dtos.response.RentalItemResponse;
import com.car.backend.modules.rental.entity.RentalDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RentalDetailMapper {
    
    @Mapping(target = "carId", source = "car.carId")
    @Mapping(target = "carName", source = "car.carName")
    @Mapping(target = "brand", source = "car.brand")
    @Mapping(target = "licensePlate", source = "car.licensePlate")
    @Mapping(target = "thumbnailUrl", source = "car.thumbnailUrl")
    RentalItemResponse toItemResponse(RentalDetail detail);
}
