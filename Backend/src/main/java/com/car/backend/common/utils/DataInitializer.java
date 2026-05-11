package com.car.backend.common.utils;

import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.enums.Role;
import com.car.backend.modules.auth.repository.UserRepository;
import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import com.car.backend.modules.car.entity.Car;
import com.car.backend.modules.car.enums.CarStatus;
import com.car.backend.modules.car.enums.FuelType;
import com.car.backend.modules.car.enums.Transmission;
import com.car.backend.modules.car.repository.CarRepository;
import com.car.backend.modules.rental.entity.Rental;
import com.car.backend.modules.rental.entity.RentalDetail;
import com.car.backend.modules.rental.enums.RentalStatus;
import com.car.backend.modules.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

/**
 * Class khởi tạo dữ liệu mẫu khi ứng dụng khởi động
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserInformationService userInformationService;
    private final CarRepository carRepository;
    private final RentalRepository rentalRepository;
    
    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting data initialization...");
        
        // 1. Khởi tạo User và UserInformation nếu chưa có
        if (userRepository.count() <= 2) { 
            createAdminUser();
            createManagerUser();
            createRegularUsers(20); 
        } else {
            log.info("Users already initialized.");
        }

        // 2. Khởi tạo Car nếu chưa có
        if (carRepository.count() == 0) {
            createSampleCars();
        } else {
            log.info("Cars already initialized.");
        }

        // 3. Khởi tạo Rental và RentalDetail
        if (rentalRepository.count() == 0) {
            createSampleRentals(25);
        } else {
            log.info("Rentals already initialized.");
        }
        
        log.info("Data initialization completed successfully!");
    }

    private void createSampleRentals(int count) {
        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRoles().contains(Role.CUSTOMER))
                .toList();
        List<User> staffList = userRepository.findAll().stream()
                .filter(u -> u.getRoles().contains(Role.STAFF))
                .toList();
        List<Car> cars = carRepository.findAll();

        if (customers.isEmpty() || cars.isEmpty()) {
            log.warn("Cannot create rentals: Customers or Cars list is empty.");
            return;
        }

        Random random = new Random();
        List<Rental> rentals = new ArrayList<>();

        for (int i = 1; i <= count; i++) {
            User customer = customers.get(random.nextInt(customers.size()));
            Car car = cars.get(random.nextInt(cars.size()));
            
            int days = random.nextInt(5) + 1;
            LocalDate startDate = LocalDate.now().minusDays(random.nextInt(30));
            LocalDate endDate = startDate.plusDays(days);
            
            BigDecimal totalPrice = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

            Rental rental = Rental.builder()
                    .customer(customer)
                    .startDate(startDate)
                    .endDate(endDate)
                    .totalPrice(totalPrice)
                    .status(RentalStatus.values()[random.nextInt(RentalStatus.values().length)])
                    .notes("Ghi chú đơn thuê mẫu số " + i)
                    .build();

            if (rental.getStatus() != RentalStatus.PENDING && !staffList.isEmpty()) {
                rental.setStaff(staffList.get(random.nextInt(staffList.size())));
            }

            RentalDetail detail = RentalDetail.builder()
                    .rental(rental)
                    .car(car)
                    .pricePerDay(car.getPricePerDay())
                    .days(days)
                    .subtotal(totalPrice)
                    .build();

            rental.setRentalDetails(new ArrayList<>(List.of(detail)));
            rentals.add(rental);
        }

        rentalRepository.saveAll(rentals);
        log.info("Created {} sample rentals with details.", count);
    }

    private void createRegularUsers(int count) {
        for (int i = 1; i <= count; i++) {
            String username = "user" + i;
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode("User@123"))
                    .email(username + "@example.com")
                    .phoneNumber("09010000" + String.format("%02d", i))
                    .roles(Set.of(Role.CUSTOMER))
                    .isEnabled(true)
                    .userNonExpired(true)
                    .userNonLocked(true)
                    .credentialsNonExpired(true)
                    .failedLoginAttempts(0)
                    .build();

            user.setCreatedDate(LocalDateTime.now());
            User savedUser = userRepository.save(user);
            
            UserInformation info = userInformationService.createInitialInformation(savedUser);
            info.setFullName("Khách Hàng Số " + i);
            info.setAddress("Địa chỉ mẫu, Quận " + (i % 10 + 1) + ", Hà Nội");
            userInformationService.save(info);
        }
        log.info("Created {} regular users with information.", count);
    }

    private void createSampleCars() {
        List<Car> cars = List.of(
            createCar("Toyota Camry 2.5Q", "Toyota", "Camry", 2024, "30A-11111", "Đen", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 1200000, "/car/ToyotaCamry2024.jpeg"),
            createCar("Honda City RS", "Honda", "City", 2023, "30A-22222", "Đỏ", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 800000, "/car/Honda-City.jpg"),
            createCar("Ford Everest Titanium", "Ford", "Everest", 2023, "30A-33333", "Trắng", 7, FuelType.DIESEL, Transmission.AUTOMATIC, 1800000, "/car/FordEverestTitanium.jpeg"),
            createCar("Mazda 3 Sedan", "Mazda", "Mazda 3", 2023, "30A-44444", "Xám", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 1000000, "/car/Mazda3Sedan2023.jpg"),
            createCar("Mazda CX-5 Premium", "Mazda", "CX-5", 2023, "30A-55555", "Xanh", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 1300000, "/car/MazdaCX-5Premium.jpeg"),
            createCar("Mitsubishi Xpander Premium", "Mitsubishi", "Xpander", 2023, "30A-66666", "Bạc", 7, FuelType.GASOLINE, Transmission.AUTOMATIC, 900000, "/car/MitsubishiXpanderPremium.jpeg"),
            createCar("Kia Morning GT-Line", "Kia", "Morning", 2024, "30A-77777", "Vàng", 4, FuelType.GASOLINE, Transmission.AUTOMATIC, 500000, "/car/KiaMorningGTLine.jpeg"),
            createCar("Kia Seltos Turbo", "Kia", "Seltos", 2024, "30A-88888", "Cam", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 950000, "/car/KiaSeltosTurbo.webp"),
            createCar("Suzuki Swift GLX", "Suzuki", "Swift", 2024, "30A-99999", "Xanh", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 750000, "/car/SuzukiSwiftGLX.jpeg"),
            createCar("Hyundai Accent Special", "Hyundai", "Accent", 2024, "30B-11111", "Trắng", 5, FuelType.GASOLINE, Transmission.AUTOMATIC, 850000, "/car/car-register.png")
        );
        carRepository.saveAll(cars);
        log.info("Created 10 sample cars.");
    }

    private Car createCar(String name, String brand, String model, int year, String plate, String color, int seats, FuelType fuel, Transmission trans, long price, String thumb) {
        return Car.builder()
                .carName(name).brand(brand).model(model).year(year)
                .licensePlate(plate).color(color).seats(seats)
                .fuelType(fuel).transmission(trans).carStatus(CarStatus.AVAILABLE)
                .pricePerDay(BigDecimal.valueOf(price))
                .description("Xe " + name + " chất lượng cao, đời " + year)
                .thumbnailUrl(thumb)
                .build();
    }

    private void createAdminUser() {
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("Admin@123"))
                .email("admin@codebase.com")
                .phoneNumber("0901234567")
                .roles(Set.of(Role.ADMIN, Role.STAFF))
                .isEnabled(true)
                .userNonExpired(true)
                .userNonLocked(true)
                .credentialsNonExpired(true)
                .failedLoginAttempts(0)
                .build();
        admin.setCreatedDate(LocalDateTime.now());
        User savedUser = userRepository.save(admin);
        UserInformation info = userInformationService.createInitialInformation(savedUser);
        info.setFullName("Quản Trị Viên");
        userInformationService.save(info);
        log.info("Created ADMIN user.");
    }

    private void createManagerUser() {
        User manager = User.builder()
                .username("manager")
                .password(passwordEncoder.encode("Manager@123"))
                .email("manager@codebase.com")
                .phoneNumber("0901234568")
                .roles(Set.of(Role.STAFF))
                .isEnabled(true)
                .userNonExpired(true)
                .userNonLocked(true)
                .credentialsNonExpired(true)
                .failedLoginAttempts(0)
                .build();
        manager.setCreatedDate(LocalDateTime.now());
        User savedUser = userRepository.save(manager);
        UserInformation info = userInformationService.createInitialInformation(savedUser);
        info.setFullName("Nhân Viên Quản Lý");
        userInformationService.save(info);
        log.info("Created STAFF user.");
    }
}
