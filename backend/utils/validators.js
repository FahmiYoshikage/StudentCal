// ============================================
// backend/utils/validators.js
// ============================================
const validator = require('validator');

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validateURL = (url) => {
    return validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
    });
};

const validateDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

const validateTime = (time) => {
    // Format: HH:MM (24-hour)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

const validateDayOfWeek = (day) => {
    return day >= 1 && day <= 7;
};

const validateScore = (score, maxScore) => {
    return score >= 0 && score <= maxScore;
};

const validateWeight = (weight) => {
    return weight >= 0 && weight <= 100;
};

const validateAmount = (amount) => {
    return !isNaN(amount) && parseFloat(amount) >= 0;
};

const sanitizeString = (str) => {
    return validator.escape(validator.trim(str));
};

module.exports = {
    validateEmail,
    validateURL,
    validateDate,
    validateTime,
    validateDayOfWeek,
    validateScore,
    validateWeight,
    validateAmount,
    sanitizeString,
};
