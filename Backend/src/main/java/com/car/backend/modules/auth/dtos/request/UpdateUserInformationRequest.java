package com.car.backend.modules.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserInformationRequest {
    @NotBlank(message = "Full name cannot be blank")
    private String fullName;
    
    private String address;
    private String phoneNumber;
    private String avatarUrl;
    
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    private String identifyId;
    private String driverLicenceId;
    
    // Nếu là Staff, có thể gửi thêm (hoặc Admin update)
    private String shift;
}
