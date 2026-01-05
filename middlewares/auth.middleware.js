import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ errors: { general: 'Access denied. No authentication token provided.' } });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ errors: { general: 'Access denied. User not found or no longer exists.' } });
        }

        req.user = { id: user._id, username: user.username, email: user.email };

        next();
    } catch (error) {
        res.status(401).json(
            { errors: { general: 'Invalid or expired authentication token. Please log in again.' } }
        );
    }
};