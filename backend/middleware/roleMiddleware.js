import jwt from 'jsonwebtoken';

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ 
                message: 'User authentication required' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient privileges.' 
            });
        }

        next();
    };
};