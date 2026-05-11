package com.car.backend.modules.rental.dtos.response;

import com.car.backend.modules.rental.enums.RentalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalResponse {
	private Long          rentalId;
	private String        customerName;
	private String        customerEmail;
	private LocalDate     startDate;
	private LocalDate     endDate;
	private BigDecimal    totalPrice;
	private RentalStatus  status;
	private LocalDateTime createdDate;
    
    // Bổ sung thông tin xe (Lấy từ xe đầu tiên trong đơn)
    private Long    carId;
    private String  carName;
    private String  brand;
    private String  thumbnailUrl;
    private Integer seats;
    private String  transmission;
}
