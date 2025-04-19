import crypto from 'crypto';

/**
 * Generates a unique transaction ID with the format: TXN_YYYYMMDDHHMMSS_RANDOM
 * @param {string} prefix - Prefix for the transaction ID (default: 'TXN')
 * @returns {string} - Unique transaction ID
 */
export const generateTransactionId = (prefix = 'TXN') => {
    // Generate timestamp in format YYYYMMDDHHMMSS
    const timestamp = new Date().toISOString()
        .replace(/[-:]/g, '')  // Remove dashes and colons
        .replace(/\..+/, '')   // Remove milliseconds
        .replace('T', '');     // Remove T separator
    
    // Generate 6 random hex characters for uniqueness
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Combine prefix, timestamp, and random string
    return `${prefix}_${timestamp}_${randomString}`;
};