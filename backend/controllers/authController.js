import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/userModel.js';
import { catchAsync, AppError } from '../middleware/errorMiddleware.js';

export const signup = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError('All fields are required', 400);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format', 400);
    }

    // Password strength validation
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const user = await createUser(name, email, password);
    
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        status: 'success',
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});