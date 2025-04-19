class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleDatabaseError = (err) => {
    // Handle Postgres specific errors
    if (err.code === '23505') { // unique_violation
        return new AppError('Duplicate entry. This record already exists.', 409);
    }
    if (err.code === '23503') { // foreign_key_violation
        return new AppError('Referenced record does not exist.', 404);
    }
    if (err.code === '23502') { // not_null_violation
        return new AppError('Required fields are missing.', 400);
    }
    if (err.code === '22P02') { // invalid_text_representation
        return new AppError('Invalid input type.', 400);
    }
    return new AppError('Database error occurred.', 500);
};

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => 
    new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () => 
    new AppError('Your token has expired. Please log in again.', 401);

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
    });

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handle specific error types
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ValidationError') {
        error = handleValidationError(err);
    }
    if (err.name === 'JsonWebTokenError') {
        error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    }
    if (err.code && err.code.startsWith('2')) { // Database errors start with 2
        error = handleDatabaseError(err);
    }

    // Development vs Production error responses
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            error: err,
            stack: err.stack
        });
    } else {
        // Don't leak error details in production
        res.status(error.statusCode).json({
            status: error.status,
            message: error.isOperational ? error.message : 'Something went wrong!'
        });
    }
};

export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export { AppError };