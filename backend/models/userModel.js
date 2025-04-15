import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUser = async (name, email, password, role = 'donor') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role';
    const values = [name, email, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

// Initialize database table
export const initializeDb = async () => {
    // Create the users table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(10) DEFAULT 'donor' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await pool.query(createTableQuery);

    // Add role column if it doesn't exist
    const checkRoleColumnQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    `;
    const roleColumnExists = await pool.query(checkRoleColumnQuery);

    if (roleColumnExists.rows.length === 0) {
        const alterTableQuery = `
            ALTER TABLE users 
            ADD COLUMN role VARCHAR(10) DEFAULT 'donor' NOT NULL,
            ADD CONSTRAINT valid_role CHECK (role IN ('donor', 'admin'))
        `;
        await pool.query(alterTableQuery);
    }
};