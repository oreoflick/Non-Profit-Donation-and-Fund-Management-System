import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import projectRoutes from './routes/projects.js';
import { initializeDb as initUserDb } from './models/userModel.js';
import { initializeDb as initDonationDb } from './models/donationModel.js';
import { initializeDb as initProjectDb } from './models/projectModel.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Initialize database tables
Promise.all([
    initUserDb(),
    initProjectDb(),
    initDonationDb()
]).catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/projects', projectRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});