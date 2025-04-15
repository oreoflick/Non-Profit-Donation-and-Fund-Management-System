import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { adminSignup, adminLogin } from '../controllers/adminAuthController.js';

const router = express.Router();

// Regular user routes
router.post('/signup', signup);
router.post('/login', login);

// Admin routes
router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);

export default router;