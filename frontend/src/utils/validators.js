// ============================================
// frontend/src/utils/validators.js
// ============================================
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value !== '';
};

export const validateNumber = (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

export const validateDate = (date) => {
    return date instanceof Date && !isNaN(date);
};
