package com.car.backend.modules.auth.dtos.response;

import com.car.backend.modules.auth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInformationResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String address;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private LocalDate dateOfBirth;
    private String identifyId;
    private String driverLicenceId;
    private Set<Role> roles;
    private boolean isEnabled;
    private LocalDateTime createdDate;
    
    // Các trường đặc thù của Staff (sẽ null nếu là Customer)
    private Double salary;
    private String shift;
    
    // Phân loại user
    private String userType; 
}
