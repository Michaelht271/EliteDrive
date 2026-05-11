package com.car.backend.modules.auth.services.interfaces;

import com.car.backend.modules.auth.dtos.request.UserRegistrationRequest;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.entities.UserInformation;

import java.util.Optional;

public interface UserInformationService {
    
    /**
     * Tạo thông tin người dùng tương ứng với Role
     */
    UserInformation createInitialInformation(User user);

    /**
     * Tạo thông tin người dùng với dữ liệu ban đầu từ Registration Request
     */
    UserInformation createInitialInformation(User user, UserRegistrationRequest request);

    /**
     * Lưu/Cập nhật UserInformation
     */
    UserInformation save(UserInformation userInformation);

    /**
     * Tìm thông tin theo UserId
     */
    Optional<UserInformation> findByUserId(Long userId);

    /**
     * Lấy tất cả thông tin người dùng
     */
    java.util.List<UserInformation> findAll();

    /**
     * Xóa thông tin (thực tế hiếm dùng vì đã có Cascade)
     */
    void deleteByUserId(Long userId);
	void validateForRental(Long userId);
}
