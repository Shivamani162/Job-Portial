const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route (check for JWT and add user to request)
exports.protect = async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
    token = token.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Employer role middleware
exports.employer = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (user.role !== 'employer') {
        return res.status(403).json({ error: 'Not authorized as employer' });
    }
    next();
};
