package com.car.backend.modules.auth.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "UserInformation")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "UserType", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
public abstract class UserInformation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userInformationId;
	
	// 🔗 Mapping 1-1 với User
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "UserId", nullable = false, unique = true)
	private User user;
	
	// Thông tin cơ bản
	@Column(name = "FullName", columnDefinition = "NVARCHAR(255)")
	private String fullName;

	@Column(name = "Address", columnDefinition = "NVARCHAR(500)")
	private String address;

	@Column(name = "DateOfBirth")
	private LocalDate dateOfBirth;

	@Column(name = "AvatarUrl")
	private String avatarUrl;

	public String getIdentifyId() {
		if (this instanceof CustomerInformation) {
			return ((CustomerInformation) this).getIdentifyId();
		}
		return null;
	}

	public String getDriverLicenceId() {
		if (this instanceof CustomerInformation) {
			return ((CustomerInformation) this).getDriverLicenceId();
		}
		return null;
	}
	}