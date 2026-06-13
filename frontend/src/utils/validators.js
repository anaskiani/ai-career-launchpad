export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateForm = (formData, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors[field] = `${field} is required`;
    }
  });

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (formData.password && !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};
