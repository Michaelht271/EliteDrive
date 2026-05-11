/**
 * Utility functions for form validation
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email là bắt buộc";
  if (!re.test(email)) return "Định dạng email không hợp lệ";
  return "";
};

export const validatePhone = (phone) => {
  const re = /^(0|\+84)\d{9}$/;
  if (!phone) return "Số điện thoại là bắt buộc";
  if (!re.test(phone)) return "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 9 chữ số tiếp theo";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Mật khẩu là bắt buộc";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === "")) {
    return `${fieldName} không được để trống`;
  }
  return "";
};

export const validateCCCD = (id) => {
  if (!id) return "Số CCCD là bắt buộc";
  if (!/^\d{12}$/.test(id)) {
    return "CCCD phải bao gồm đúng 12 chữ số";
  }
  return "";
};

export const validateDriverLicense = (id) => {
  if (!id) return "Số bằng lái xe là bắt buộc";
  if (!/^\d{12}$/.test(id)) {
    return "Bằng lái xe phải bao gồm đúng 12 chữ số";
  }
  return "";
};

/**
 * Hợp nhất các validation cho Login
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  // Kiểm tra username (có thể là email hoặc sđt)
  if (!data.username) {
    errors.username = "Vui lòng nhập email hoặc số điện thoại";
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Hợp nhất các validation cho Register
 */
export const validateRegisterForm = (data) => {
  const errors = {};

  errors.fullName = validateRequired(data.fullName, "Họ và tên");
  errors.email = validateEmail(data.email);
  errors.phoneNumber = validatePhone(data.phoneNumber);
  errors.username = validateRequired(data.username, "Tên đăng nhập");
  errors.identifyId = validateCCCD(data.identifyId);
  errors.address = validateRequired(data.address, "Địa chỉ");
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Hợp nhất các validation cho Profile
 */
export const validateProfileForm = (data, roles = { isAdmin: false, isStaff: false }) => {
  const errors = {};

  const fullNameError = validateRequired(data.fullName, "Họ và tên");
  if (fullNameError) errors.fullName = fullNameError;

  const phoneError = validatePhone(data.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const addressError = validateRequired(data.address, "Địa chỉ");
  if (addressError) errors.address = addressError;
  
  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 18) {
      errors.dateOfBirth = "Bạn phải từ 18 tuổi trở lên";
    }
  } else {
    errors.dateOfBirth = "Ngày sinh là bắt buộc";
  }

  // Chỉ validate CCCD và Bằng lái cho Customer (người dùng bình thường)
  if (!roles.isAdmin && !roles.isStaff) {
    const cccdError = validateCCCD(data.identifyId);
    if (cccdError) errors.identifyId = cccdError;

    const licenseError = validateDriverLicense(data.driverLicenceId);
    if (licenseError) errors.driverLicenceId = licenseError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

