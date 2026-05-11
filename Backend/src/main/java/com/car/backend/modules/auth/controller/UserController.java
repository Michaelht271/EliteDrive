package com.car.backend.modules.auth.controller;

import com.car.backend.modules.auth.dtos.UserMapper;
import com.car.backend.modules.auth.dtos.request.UserRegistrationRequest;
import com.car.backend.modules.auth.dtos.response.UserInformationResponse;
import com.car.backend.modules.auth.dtos.response.UserRegistrationResponse;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.services.UserService;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserInformationService userInformationService;
    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Lấy danh sách tất cả người dùng (Chỉ Admin)
     */
    @GetMapping
    public ResponseEntity<List<UserInformationResponse>> getAllUsers() {
        log.info("Admin fetching all users - START");
        try {
            List<UserInformation> allInfo = userInformationService.findAll();
            log.info("Found {} user information records", allInfo.size());
            
            List<UserInformationResponse> responses = allInfo.stream()
                    .map(info -> {
                        try {
                            return userMapper.toUserInformationResponse(info);
                        } catch (Exception e) {
                            log.error("Error mapping user info ID {}: {}", info.getUserInformationId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList());
            
            log.info("Admin fetching all users - SUCCESS, returning {} records", responses.size());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Global error in getAllUsers: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Tạo người dùng mới (Chỉ Admin)
     */
    @PostMapping
    public ResponseEntity<UserRegistrationResponse> createUser(@Valid @RequestBody UserRegistrationRequest request) {
        log.info("Admin creating new user: {}", request.getUsername());
        return ResponseEntity.ok(userService.registerByAdmin(request));
    }

    /**
     * Khóa tài khoản người dùng
     */
    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) throws AccountNotFoundException {
        log.info("Admin disabling user ID: {}", id);
        userService.disableUser(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Mở khóa tài khoản người dùng
     */
    @PutMapping("/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable Long id) throws AccountNotFoundException {
        log.info("Admin enabling user ID: {}", id);
        userService.enableUser(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa người dùng (Vĩnh viễn)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Admin deleting user ID: {}", id);
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
