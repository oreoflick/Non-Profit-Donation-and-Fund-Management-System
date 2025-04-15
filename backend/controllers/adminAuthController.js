import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/userModel.js';

export const adminSignup = async (req, res) => {
    try {
        const { name, email, password, adminCode } = req.body;

        // Validate input including admin code
        if (!name || !email || !password || !adminCode) {
            return res.status(400).json({ message: 'All fields are required including admin registration code' });
        }

        // Verify admin registration code
        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return res.status(403).json({ message: 'Invalid admin registration code' });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new admin user
        const user = await createUser(name, email, password, 'admin');
        
        // Generate JWT token with role
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Admin user created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({ message: 'Error creating admin user' });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify if user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with role
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Error during admin login' });
    }
};