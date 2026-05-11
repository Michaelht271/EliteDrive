package com.car.backend.modules.auth.utils;


import com.car.backend.modules.auth.entities.AdminInformation;
import com.car.backend.modules.auth.entities.CustomerInformation;
import com.car.backend.modules.auth.entities.StaffInformation;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.enums.Role;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Factory để tạo đối tượng UserInformation tương ứng với Role của người dùng
 */
@Component
public class UserInformationFactory {

    /**
     * Tạo đối tượng UserInformation dựa trên tập hợp các vai trò (Roles) của User
     * Thứ tự ưu tiên: ADMIN > STAFF (MANAGER) > CUSTOMER
     * 
     * @param roles danh sách vai trò của người dùng
     * @return một instance của subclass UserInformation (Admin, Staff, hoặc Customer)
     */
    public UserInformation createInformation(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return new CustomerInformation(); // Mặc định là khách hàng
        }

     
        if (roles.contains(Role.ADMIN)) {
            return new AdminInformation();
        }

        if (roles.contains(Role.STAFF) ) {
            return new StaffInformation();
        }

        return new CustomerInformation();
    }
}
