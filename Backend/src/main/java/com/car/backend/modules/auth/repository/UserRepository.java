package com.car.backend.modules.auth.repository;


import com.car.backend.modules.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	// ✅ Đổi từ User sang Optional<User>
	Optional<User> findByUsername(String username);
	
	Optional<User> findByEmail(String email);

	Optional<User> findByResetPasswordToken(String token);

	boolean existsByUsername(String username);	
	boolean existsByEmail(String email);
	
	// Thêm query cho admin
	List<User> findByIsEnabledFalse();  // Users bị disabled
	List<User> findByUserNonLockedFalse();  // Users bị locked
}