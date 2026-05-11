package com.car.backend.modules.auth.services.impl;

import com.car.backend.modules.auth.dtos.request.UserRegistrationRequest;
import com.car.backend.modules.auth.entities.CustomerInformation;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.repository.UserInformationRepository;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import com.car.backend.modules.auth.utils.UserInformationFactory;
import com.car.backend.modules.rental.exception.IncompleteProfileException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInformationServiceImpl implements UserInformationService {
	
	private final UserInformationRepository userInformationRepository;
	private final UserInformationFactory userInformationFactory;

	@Override
	@Transactional
	public UserInformation createInitialInformation(User user) {
		return createInitialInformation(user, null);
	}

	@Override
	@Transactional
	public UserInformation createInitialInformation(User user, UserRegistrationRequest request) {
		log.info("Creating initial information for user: {}", user.getUsername());

		// Dùng factory để tạo ra đúng loại con (Admin, Staff, hay Customer)
		UserInformation info = userInformationFactory.createInformation(user.getRoles());

		// Gán liên kết 1-1
		info.setUser(user);

		// Nếu có request, gán thêm thông tin ban đầu
		if (request != null) {
			info.setFullName(request.getFullName());
			info.setAddress(request.getAddress());

			if (info instanceof CustomerInformation customer) {
				customer.setIdentifyId(request.getIdentifyId());
			}
		}

		return userInformationRepository.save(info);
	}

	@Override
	@Transactional
	public UserInformation save(UserInformation userInformation) {
		return userInformationRepository.save(userInformation);
	}

	@Override
	public Optional<UserInformation> findByUserId(Long userId) {
		return userInformationRepository.findByUser_UserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public java.util.List<UserInformation> findAll() {
		return userInformationRepository.findAll();
	}

	@Override
	@Transactional
	public void deleteByUserId(Long userId) {
		userInformationRepository.deleteByUser_UserId(userId);
	}
	
	/**
	 * Validate profile đủ điều kiện để đặt xe.
	 * Throw IncompleteProfileException với danh sách field còn thiếu.
	 */
	public void validateForRental(Long userId) {
		UserInformation info = userInformationRepository
				.findByUser_UserId(userId)
				.orElseThrow(() -> new IncompleteProfileException(
						List.of("Chưa có thông tin cá nhân — vui lòng cập nhật profile")
				));
		
		List<String> missing = new ArrayList<>();
		
		if (isBlank(info.getFullName())) {
			missing.add("Họ và tên");
		}
		if (isBlank(info.getIdentifyId())) {
			missing.add("Số CCCD/CMND");
		}
		if (isBlank(info.getDriverLicenceId())) {
			missing.add("Số bằng lái xe");
		}
		if (info.getDateOfBirth() == null) {
			missing.add("Ngày sinh");
		}
		
		if (!missing.isEmpty()) {
			throw new IncompleteProfileException(missing);
		}
	}
	
	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}
}
