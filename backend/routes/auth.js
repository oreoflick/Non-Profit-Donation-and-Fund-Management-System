import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { adminSignup, adminLogin } from '../controllers/adminAuthController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (hashed when stored)
 *         role:
 *           type: string
 *           enum: [donor, admin]
 *           description: The user's role in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new donor user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Donor 1"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "donor1@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "donor100"
 *                 description: "minimum 8 characters"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "All fields are required"
 *                     - "Invalid email format"
 *                     - "Password must be at least 8 characters long"
 *       409:
 *         description: User already exists
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login for donor users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "donor1@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "donor100"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/admin/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - adminCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin 1"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin1@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "admin100"
 *               adminCode:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       201:
 *         description: Admin user successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Admin user created successfully"
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "All fields are required including admin registration code"
 *                     - "Invalid email format"
 *                     - "Password must be at least 8 characters long"
 *       403:
 *         description: Invalid admin registration code
 *       409:
 *         description: User already exists
 *       500:
 *         description: Admin registration is not properly configured
 */
router.post('/admin/signup', adminSignup);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login for admin users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin1@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "admin100"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Admin login successful"
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied - Admin privileges required
 */
router.post('/admin/login', adminLogin);

export default router;