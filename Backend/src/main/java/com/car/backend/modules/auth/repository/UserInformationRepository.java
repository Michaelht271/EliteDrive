package com.car.backend.modules.auth.repository;

import com.car.backend.modules.auth.entities.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInformationRepository extends JpaRepository<UserInformation, Long> {
    
    Optional<UserInformation> findByUser_UserId(Long userId);
    
    void deleteByUser_UserId(Long userId);
}
