package com.car.backend.modules.auth.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@DiscriminatorValue("CUSTOMER")
@Getter
@Setter
@NoArgsConstructor
public class CustomerInformation extends UserInformation {

        // CCCD
        @Column(name = "IdentifyId", unique = true)
        private String identifyId;

        // GPLX
        @Column(name = "DriverLicenceId", unique = true)
        private String driverLicenceId;

}
