package com.car.backend.modules.auth.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("STAFF")
@Getter
@Setter
@NoArgsConstructor
public class StaffInformation extends UserInformation {
    // Thêm các trường đặc thù của Staff (nhân viên)
    @Column(name = "Salary")
    private Double salary;

    @Column(name = "Shift")
    private String shift; // Ví dụ: Ca sáng, Ca chiều
}
