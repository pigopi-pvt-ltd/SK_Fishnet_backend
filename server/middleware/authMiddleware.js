import jwt from 'jsonwebtoken';
import User from '../modules/auth/auth.model.js'; // Import User model to fetch user details from DB

const protect = async (req, res, next) => {
    let token;

    // Find token in cookies of the incoming request
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If token is not found, return unauthorized error
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided. Please login.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user associated with the token and attach to request object (without password)
        req.user = await User.findById(decoded.id).select('-password');

        
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: 'Not authorized, token failed or expired.' });
    }
};

// Admin-only middleware to restrict access to certain routes
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ error: 'Not authorized as an Admin.' });
    }
};

export { protect, adminOnly };