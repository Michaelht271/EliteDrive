package com.car.backend.common.anotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;

import java.time.LocalDate;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    private String startDateField;
    private String endDateField;

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.startDateField = constraintAnnotation.startDateField();
        this.endDateField = constraintAnnotation.endDateField();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            Object startDateObj = new BeanWrapperImpl(value).getPropertyValue(startDateField);
            Object endDateObj = new BeanWrapperImpl(value).getPropertyValue(endDateField);

            if (startDateObj == null || endDateObj == null) {
                return true; // Let @NotNull handle this
            }

            LocalDate startDate = (LocalDate) startDateObj;
            LocalDate endDate = (LocalDate) endDateObj;

            return endDate.isAfter(startDate) || endDate.isEqual(startDate);
        } catch (Exception e) {
            return false;
        }
    }
}
