package com.car.backend.exception;

import com.car.backend.exception.custom.ErrorResponse;
import com.car.backend.modules.car.exception.ConflictException;
import com.car.backend.modules.rental.exception.IncompleteProfileException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return buildErrorResponse("AUTHENTICATION_FAILED", "Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UsernameNotFoundException ex) {
        return buildErrorResponse("USER_NOT_FOUND", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return buildErrorResponse("BAD_REQUEST", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse("VALIDATION_FAILED", details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return buildErrorResponse("INTERNAL_SERVER_ERROR", "Có lỗi xảy ra, vui lòng thử lại sau", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(String error, String message, HttpStatus status) {
        ErrorResponse response = ErrorResponse.builder()
                .error(error)
                .message(message)
                .status(status.value())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, status);
    }
	
	@ExceptionHandler(IncompleteProfileException.class)
	public ResponseEntity<ErrorResponse> handleIncompleteProfile(IncompleteProfileException ex) {
		String missingInfo = String.join(", ", ex.getMissingFields());
		return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
				ErrorResponse.builder()
				             .status(422)
				             .error("INCOMPLETE_PROFILE")
				             .message("Vui lòng cập nhật đầy đủ thông tin hồ sơ để thực hiện đặt xe: " + missingInfo)
				             .build()
		);
	}
	

	
	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ErrorResponse> handleConflictException(ConflictException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(
				ErrorResponse.builder()
						.status(HttpStatus.CONFLICT.value())
						.error("CONFLICT")
						.message(ex.getMessage())
						.timestamp(LocalDateTime.now())
						.build()
		);
	}
}
