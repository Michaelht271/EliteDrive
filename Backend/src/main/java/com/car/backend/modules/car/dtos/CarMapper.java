
package com.car.backend.modules.car.dtos;

import com.car.backend.modules.car.dtos.request.CreateCarRequest;
import com.car.backend.modules.car.dtos.request.UpdateCarRequest;
import com.car.backend.modules.car.dtos.response.CarDetailResponse;
import com.car.backend.modules.car.dtos.response.CarResponse;
import com.car.backend.modules.car.entity.Car;
import org.mapstruct.*;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(
		componentModel = "spring",
		nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
		builder = @Builder(disableBuilder = true)
)
public interface CarMapper {
	
	// CreateCarRequest → Car entity
	@Mapping(target = "carId",     ignore = true)
	@Mapping(target = "deleted", ignore = true)
	@Mapping(target = "carStatus", ignore = true) // default AVAILABLE từ entity
	@Mapping(target = "createdBy", ignore = true)
	@Mapping(target = "createdDate", ignore = true)
	@Mapping(target = "lastModifiedBy", ignore = true)
	@Mapping(target = "lastModifiedDate", ignore = true)
	Car toEntity(CreateCarRequest request);
	
	@Mapping(target = "carId",     ignore = true)
	@Mapping(target = "deleted", ignore = true)
	@Mapping(target = "carStatus", ignore = true) // dùng updateStatus() riêng
	@Mapping(target = "createdBy", ignore = true)
	@Mapping(target = "createdDate", ignore = true)
	@Mapping(target = "lastModifiedBy", ignore = true)
	@Mapping(target = "lastModifiedDate", ignore = true)
	void updateEntity(UpdateCarRequest request, @MappingTarget Car car);
	

	CarResponse toResponse(Car car);
	

	// Car → CarDetailResponse (detail)
	// licensePlate chỉ expose ở detail, không ở list
	@Mapping(target = "createdAt", source = "createdDate")
	@Mapping(target = "updatedAt", source = "lastModifiedDate")
	CarDetailResponse toDetailResponse(Car car);
}