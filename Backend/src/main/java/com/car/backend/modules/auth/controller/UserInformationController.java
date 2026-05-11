package com.car.backend.modules.auth.controller;

import com.car.backend.common.anotations.CurrentUserId;
import com.car.backend.exception.custom.bussiness.ResourceNotFoundException;
import com.car.backend.modules.auth.dtos.UserMapper;
import com.car.backend.modules.auth.dtos.request.UpdateUserInformationRequest;
import com.car.backend.modules.auth.dtos.response.UserInformationResponse;
import com.car.backend.modules.auth.entities.CustomerInformation;
import com.car.backend.modules.auth.entities.StaffInformation;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.services.UserService;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user-info")
@RequiredArgsConstructor
@Slf4j
public class UserInformationController {

    private final UserInformationService userInformationService;
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserInformationResponse> getMyProfile(@CurrentUserId Long userId) {
        log.info("Fetching profile for user ID: {}", userId);
        
        Optional<UserInformation> infoOpt = userInformationService.findByUserId(userId);
        
        if (infoOpt.isPresent()) {
            return ResponseEntity.ok(userMapper.toUserInformationResponse(infoOpt.get()));
        }

        // Nếu thiếu thông tin, tự động tạo mới để tránh lỗi hệ thống
        log.warn("User information not found for ID: {}. Creating initial information.", userId);
        try {
            User user = userService.loadUserById(userId);
            UserInformation newInfo = userInformationService.createInitialInformation(user);
            return ResponseEntity.ok(userMapper.toUserInformationResponse(newInfo));
        } catch (Exception e) {
            log.error("Failed to create missing user information: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cập nhật hồ sơ cá nhân
     */
    @PutMapping("/me")
    @Transactional
    public ResponseEntity<UserInformationResponse> updateMyProfile(
            @CurrentUserId Long userId,
            @Valid @RequestBody UpdateUserInformationRequest request) {
        
        log.info("Updating profile for user ID: {}", userId);
        
        UserInformation info = userInformationService.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User information not found for ID: " + userId));
        
        // Cập nhật thông tin chung
        info.setFullName(request.getFullName());
        info.setAddress(request.getAddress());
        info.setAvatarUrl(request.getAvatarUrl());
        info.setDateOfBirth(request.getDateOfBirth());
        
        // Cập nhật số điện thoại trong thực thể User
        if (info.getUser() != null && StringUtils.hasText(request.getPhoneNumber())) {
            info.getUser().setPhoneNumber(request.getPhoneNumber());
        }
        
        // Cập nhật thông tin đặc thù
        if (info instanceof CustomerInformation customer) {
            if (StringUtils.hasText(request.getIdentifyId())) {
                customer.setIdentifyId(request.getIdentifyId());
            }
            if (StringUtils.hasText(request.getDriverLicenceId())) {
                customer.setDriverLicenceId(request.getDriverLicenceId());
            }
        }
        
        // Nếu là Staff, cho phép cập nhật Shift (Ca làm việc)
        if (info instanceof StaffInformation staff && StringUtils.hasText(request.getShift())) {
            staff.setShift(request.getShift());
        }
        
        UserInformation updatedInfo = userInformationService.save(info);
        return ResponseEntity.ok(userMapper.toUserInformationResponse(updatedInfo));
    }
}
