import * as authService from './auth.service.js';

// Common cookie options
const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// 1. SIGNUP / REGISTER ADMIN
const registerAdmin = async (req, res) => {
    try {
        const { user, token } = await authService.registerAdmin(req.body);

        res.cookie('token', token, cookieOptions);

        res.status(201).json({ 
            message: "Admin account created successfully", 
            data: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                businessId: user.businessId // <--- ADDED SAAS DATA
            } 
        });
    } catch (error) {
        if (error.message === "User already exists with this email") {
            return res.status(400).json({ error: error.message });
        }
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// 2. LOGIN ADMIN
const loginAdmin = async (req, res) => {
    try {
        const { user, token } = await authService.loginAdmin(req.body);

        res.cookie('token', token, cookieOptions);

        res.json({ 
            message: "Login successful", 
            data: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                businessId: user.businessId // <--- ADDED SAAS DATA
            } 
        });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            return res.status(401).json({ error: error.message });
        }
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};

// 3. LOGOUT ADMIN
const logoutAdmin = (req, res) => {
    res.cookie('token', '', {
        ...cookieOptions,
        maxAge: 0, 
        expires: new Date(0)
    });
    res.json({ message: "Logged out successfully" });
};

// 4. CHECK LOGGED IN USER
const getMe = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        
        res.json({
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                businessId: user.businessId // <--- ADDED SAAS DATA
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { registerAdmin, loginAdmin, logoutAdmin, getMe };