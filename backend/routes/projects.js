import express from 'express';
import {
    createNewProject,
    listProjects,
    getProject,
    updateProjectDetails,
    removeProject
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateProject } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - goalAmount
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: The project description
 *         goalAmount:
 *           type: number
 *           format: float
 *           description: The funding goal amount
 *         currentAmount:
 *           type: number
 *           format: float
 *           description: The current amount raised
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           description: The project status
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects
 *     description: Retrieve a list of all projects
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: integer
 *                   description: Number of projects returned
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', listProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:id', getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - goalAmount
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Project"
 *               description:
 *                 type: string
 *                 example: "Project description"
 *               goalAmount:
 *                 type: number
 *                 format: float
 *                 example: 5000.00
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                   example: "Project created successfully"
 *                 project:
 *                   $ref: '#/components/schemas/Project'
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
 *                     - "Project name and goal amount are required"
 *                     - "Goal amount must be greater than 0"
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Access denied. Admin privileges required
 */
router.post('/', authenticateToken, authorize('admin'), validateProject, createNewProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update project details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Project Name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               goalAmount:
 *                 type: number
 *                 format: float
 *                 example: 6000.00
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                   example: "Project updated successfully"
 *                 project:
 *                   $ref: '#/components/schemas/Project'
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
 *                     - "Goal amount must be greater than 0"
 *                     - "No updates provided"
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Access denied. Admin privileges required
 *       404:
 *         description: Project not found
 */
router.put('/:id', authenticateToken, authorize('admin'), validateProject, updateProjectDetails);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *                   example: "Project deleted successfully"
 *       401:
 *         description: Authentication token required
 *       403:
 *         description: Access denied. Admin privileges required
 *       404:
 *         description: Project not found
 */
router.delete('/:id', authenticateToken, authorize('admin'), removeProject);

export default router;