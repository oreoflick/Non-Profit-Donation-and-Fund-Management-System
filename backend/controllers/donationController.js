import { getUserDonations, createDonation } from '../models/donationModel.js';
import { getProjectById } from '../models/projectModel.js';
import { catchAsync, AppError } from '../middleware/errorMiddleware.js';
import { generateTransactionId } from '../utils/transactionUtils.js';

export const getUserDonationHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const donationHistory = await getUserDonations(userId);
    
    if (!donationHistory.user) {
        throw new AppError('No donations found for this user', 404);
    }

    res.json({
        status: 'success',
        data: donationHistory
    });
});

export const makeDonation = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const {
        projectId,
        amount,
        paymentMethod,
        notes
    } = req.body;

    // Verify project exists
    const project = await getProjectById(projectId);
    if (!project) {
        throw new AppError('Project not found', 404);
    }

    // Verify project is active
    if (project.status !== 'active') {
        throw new AppError('Cannot donate to an inactive project', 400);
    }

    // Generate a unique transaction ID for this donation
    const transactionId = generateTransactionId();

    const donation = await createDonation({
        userId,
        projectId,
        amount,
        paymentMethod,
        transactionId,  // Auto-generated transaction ID
        notes,
        status: 'completed',
        receipt_url: null
    });

    res.status(201).json({
        status: 'success',
        message: 'Donation created successfully',
        donation
    });
});