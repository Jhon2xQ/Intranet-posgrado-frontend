// Form validation utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
    return errors;
  }
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return errors;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) {
    return 'Confirme la contraseña';
  }
  
  if (password !== confirmation) {
    return 'Las contraseñas no coinciden';
  }
  
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} es requerido`;
  }
  return null;
};

// DNI validation (Peru)
export const validateDNI = (dni) => {
  if (!dni) return 'DNI es requerido';
  
  const dniRegex = /^\d{8}$/;
  if (!dniRegex.test(dni)) {
    return 'DNI debe tener 8 dígitos';
  }
  
  return null;
};

// Phone validation (Peru)
export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  
  const phoneRegex = /^(\+51|51)?[9]\d{8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Formato de teléfono inválido';
  }
  
  return null;
};

// Generic form validation
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${rule.label || field} es requerido`;
      return;
    }
    
    if (value && rule.validator) {
      const error = rule.validator(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};
