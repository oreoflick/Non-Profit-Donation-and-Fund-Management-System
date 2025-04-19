import pool from '../config/db.js';
import { updateProjectAmount } from './projectModel.js';

export const initializeDb = async () => {
    const createDonationsTableQuery = `
        CREATE TABLE IF NOT EXISTS donations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            donation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT 'pending' NOT NULL,
            receipt_url TEXT,
            payment_method VARCHAR(50),
            transaction_id VARCHAR(255),
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed'))
        )
    `;
    await pool.query(createDonationsTableQuery);
};

export const getUserDonations = async (userId) => {
    const query = `
        SELECT d.amount, d.donation_date, d.status, d.receipt_url, u.name, u.email
        FROM donations d
        JOIN users u ON d.user_id = u.id
        WHERE d.user_id = $1
        ORDER BY d.donation_date DESC
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
        return { user: null, donations: [] };
    }

    // Extract user info from first row since it's the same for all rows
    const user = {
        name: result.rows[0].name,
        email: result.rows[0].email
    };

    // Map donations excluding user info
    const donations = result.rows.map(row => ({
        amount: row.amount,
        donation_date: row.donation_date,
        status: row.status,
        receipt_url: row.receipt_url
    }));

    return { user, donations };
};

export const createDonation = async ({
    userId,
    projectId,
    amount,
    paymentMethod,
    transactionId,
    notes,
    status = 'pending',
    receipt_url = null
}) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Insert the donation
        const donationQuery = `
            INSERT INTO donations 
            (user_id, project_id, amount, payment_method, transaction_id, notes, status, receipt_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const donationValues = [userId, projectId, amount, paymentMethod, transactionId, notes, status, receipt_url];
        const donationResult = await client.query(donationQuery, donationValues);
        
        // Update project's current amount if donation is completed
        if (status === 'completed') {
            await updateProjectAmount(projectId, amount);
        }
        
        await client.query('COMMIT');
        return donationResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};