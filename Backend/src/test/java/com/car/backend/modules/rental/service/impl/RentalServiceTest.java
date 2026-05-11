package com.car.backend.modules.rental.service.impl;

import com.car.backend.exception.custom.bussiness.ResourceNotFoundException;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.repository.UserRepository;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.exception.ConflictException;
import com.car.backend.modules.car.repository.CarRepository;
import com.car.backend.modules.rental.dtos.RentalMapper;
import com.car.backend.modules.rental.dtos.request.CreateRentalRequest;
import com.car.backend.modules.rental.dtos.response.RentalDetailResponse;
import com.car.backend.modules.rental.entity.Rental;
import com.car.backend.modules.rental.repository.RentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    @Mock
    private RentalRepository rentalRepository;
    @Mock
    private CarRepository carRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RentalMapper rentalMapper;
    @Mock
    private UserInformationService userInformationService;

    @InjectMocks
    private RentalServiceImpl rentalService;

    private User customer;
    private Car car;
    private CreateRentalRequest request;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setUserId(1L);

        car = new Car();
        car.setCarId(1L);
        car.setCarStatus(CarStatus.AVAILABLE);
        car.setPricePerDay(BigDecimal.valueOf(500000));

        request = new CreateRentalRequest();
        request.setCarId(1L);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(3));
    }

    @Test
    void createRental_Success() {
        // Arrange
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(rentalRepository.countConflictingRentals(any(), any(), any())).thenReturn(0L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(rentalRepository.save(any(Rental.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(rentalMapper.toDetailResponse(any(Rental.class))).thenReturn(new RentalDetailResponse());

        // Act
        RentalDetailResponse response = rentalService.createRental(request, 1L);

        // Assert
        assertNotNull(response);
        verify(userInformationService).validateForRental(1L);
        verify(rentalRepository).save(any(Rental.class));
    }

    @Test
    void createRental_CarNotFound_ThrowsException() {
        // Arrange
        when(carRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> rentalService.createRental(request, 1L));
    }

    @Test
    void createRental_CarNotAvailable_ThrowsException() {
        // Arrange
        car.setCarStatus(CarStatus.UNAVAILABLE);
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));

        // Act & Assert
        assertThrows(ConflictException.class, () -> rentalService.createRental(request, 1L));
    }

    @Test
    void createRental_InvalidDates_ThrowsException() {
        // Arrange
        request.setStartDate(LocalDate.now().plusDays(5));
        request.setEndDate(LocalDate.now().plusDays(3)); // End before start
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));

        // Act & Assert
        assertThrows(ConflictException.class, () -> rentalService.createRental(request, 1L));
    }

    @Test
    void createRental_DateConflict_ThrowsException() {
        // Arrange
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(rentalRepository.countConflictingRentals(any(), any(), any())).thenReturn(1L);

        // Act & Assert
        assertThrows(ConflictException.class, () -> rentalService.createRental(request, 1L));
    }
}
