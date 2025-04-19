import express from 'express';
import { getUserDonationHistory, makeDonation } from '../controllers/donationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateDonation } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       required:
 *         - projectId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the donation
 *         userId:
 *           type: integer
 *           description: ID of the donor
 *         projectId:
 *           type: integer
 *           description: ID of the project being donated to
 *         amount:
 *           type: number
 *           format: float
 *           description: The donation amount
 *         donationDate:
 *           type: string
 *           format: date-time
 *           description: The date and time of the donation
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: The status of the donation
 *         paymentMethod:
 *           type: string
 *           description: The method of payment
 *         transactionId:
 *           type: string
 *           description: Unique transaction identifier
 *         notes:
 *           type: string
 *           description: Optional notes for the donation
 */

/**
 * @swagger
 * /api/donations/history:
 *   get:
 *     tags:
 *       - Donations
 *     summary: Get user's donation history
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's donation history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john@example.com"
 *                     donations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: string
 *                             format: decimal
 *                             example: "100.00"
 *                           donation_date:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                             enum: [pending, completed, failed]
 *                           receipt_url:
 *                             type: string
 *                             nullable: true
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: No donations found for this user
 */
router.get('/history', authenticateToken, authorize('donor', 'admin'), getUserDonationHistory);

/**
 * @swagger
 * /api/donations/make-donation:
 *   post:
 *     tags:
 *       - Donations
 *     summary: Make a new donation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               projectId:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the project to donate to
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 15000.00
 *                 description: Donation amount
 *               paymentMethod:
 *                 type: string
 *                 example: "UPI_Intent"
 *                 description: Method of payment
 *               notes:
 *                 type: string
 *                 example: "Thank you for helping those children."
 *                 description: Optional notes for the donation
 *     responses:
 *       201:
 *         description: Donation created successfully
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
 *                   example: "Donation created successfully"
 *                 donation:
 *                   $ref: '#/components/schemas/Donation'
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
 *                     - "Project ID, amount, and payment method are required"
 *                     - "Donation amount must be greater than 0"
 *                     - "Cannot donate to an inactive project"
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: Project not found
 */
router.post('/make-donation', authenticateToken, authorize('donor'), validateDonation, makeDonation);

export default router;