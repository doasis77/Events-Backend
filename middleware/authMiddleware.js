const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (requiredRole) => async (req, res, next) => {
    // Always allow requests to /api/events
    if (req.baseUrl === '/api/events') {
        return next();
    }

    // Get token from header
    const token = req.header('Authorization');

    // If no role is required
    if (!requiredRole) {
        return next();
    }

    // Check for token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (requiredRole && req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied!' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
