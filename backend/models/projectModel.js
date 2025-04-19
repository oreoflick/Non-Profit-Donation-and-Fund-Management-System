import pool from '../config/db.js';

export const initializeDb = async () => {
    const createProjectsTableQuery = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            goal_amount DECIMAL(10,2) NOT NULL,
            current_amount DECIMAL(10,2) DEFAULT 0.00,
            status VARCHAR(20) DEFAULT 'active' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT valid_project_status CHECK (status IN ('active', 'completed', 'cancelled'))
        )
    `;
    await pool.query(createProjectsTableQuery);
};

export const createProject = async ({ name, description, goalAmount }) => {
    const query = `
        INSERT INTO projects (name, description, goal_amount)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, goalAmount]);
    return result.rows[0];
};

export const getProjectById = async (id) => {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const getAllProjects = async () => {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
};

export const updateProject = async (id, { name, description, goalAmount, status }) => {
    const updates = [];
    const values = [id];
    let valueIndex = 2;

    if (name) {
        updates.push(`name = $${valueIndex}`);
        values.push(name);
        valueIndex++;
    }
    if (description) {
        updates.push(`description = $${valueIndex}`);
        values.push(description);
        valueIndex++;
    }
    if (goalAmount) {
        updates.push(`goal_amount = $${valueIndex}`);
        values.push(goalAmount);
        valueIndex++;
    }
    if (status) {
        updates.push(`status = $${valueIndex}`);
        values.push(status);
        valueIndex++;
    }

    if (updates.length === 0) return null;

    const query = `
        UPDATE projects 
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const updateProjectAmount = async (id, amount) => {
    const query = `
        UPDATE projects 
        SET current_amount = current_amount + $1
        WHERE id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [amount, id]);
    return result.rows[0];
};

export const deleteProject = async (id) => {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};