export const validateDonation = (req, res, next) => {
    const { projectId, amount, paymentMethod } = req.body;

    if (!projectId || !amount || !paymentMethod) {
        return res.status(400).json({
            message: 'Project ID, amount, and payment method are required'
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            message: 'Donation amount must be greater than 0'
        });
    }

    next();
};

export const validateProject = (req, res, next) => {
    const { name, goalAmount } = req.body;

    if (!name || !goalAmount) {
        return res.status(400).json({
            message: 'Project name and goal amount are required'
        });
    }

    if (goalAmount <= 0) {
        return res.status(400).json({
            message: 'Goal amount must be greater than 0'
        });
    }

    next();
};