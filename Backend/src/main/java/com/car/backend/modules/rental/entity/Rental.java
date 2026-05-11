package com.car.backend.modules.rental.entity;

import com.car.backend.base.BaseEntity;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.rental.enums.RentalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Rentals")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Rental extends BaseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long rentalId;
	
	@ManyToOne( fetch = FetchType.LAZY)
	@JoinColumn(name= "CustomerId", nullable = false)
	private User customer;
	
	@ManyToOne( fetch = FetchType.LAZY)
	@JoinColumn(name="StaffId")
	private User staff;
	
	@Column(name = "startDate", nullable = false)
	private LocalDate startDate;
	
	@Column(name = "endDate", nullable = false)
	private LocalDate endDate;
	
	@Column(name = "actualStartDate")
	private LocalDateTime actualStartDate;
	
	@Column(name = "actualEndDate")
	private LocalDateTime actualEndDate;
	
	@Column(name = "totalPrice", nullable = false)
	private BigDecimal totalPrice;
	
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private RentalStatus status =  RentalStatus.PENDING;
	
	@Column(name = "cancelReason", length = 500)
	private String cancelReason;
	
	@Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
	private String notes;
	
	@Builder.Default
	@OneToMany(mappedBy = "rental",
			cascade = CascadeType.ALL,
			orphanRemoval = true)
	private List<RentalDetail> rentalDetails = new ArrayList<>();
	
	@Override
	public Long getID() {
		return rentalId;
	}
}
