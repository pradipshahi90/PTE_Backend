import jwt from 'jsonwebtoken';

// Verify JWT token
export const protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user info in request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin role middleware
export const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};
