// ============================================
// backend/middleware/auth.js
// ============================================
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Authentication required',
    });
};

const ensureGoogleAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.googleAccessToken) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Google authentication required',
    });
};

module.exports = {
    ensureAuthenticated,
    ensureGoogleAuth,
};
