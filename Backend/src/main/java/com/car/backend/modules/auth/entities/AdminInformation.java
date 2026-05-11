package com.car.backend.modules.auth.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
public class AdminInformation extends UserInformation {
    // Thêm các trường đặc thù của Admin ở đây nếu cần
}
