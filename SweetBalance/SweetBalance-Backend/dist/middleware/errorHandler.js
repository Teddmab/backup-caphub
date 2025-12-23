"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const errorResponse = {
            error: 'Validation failed',
            statusCode: 400,
            details: err.issues.map((error) => ({
                field: error.path.join('.'),
                message: error.message
            }))
        };
        res.status(400).json(errorResponse);
        return;
    }
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        // Unique constraint violation
        if (prismaError.code === 'P2002') {
            const errorResponse = {
                error: 'A record with this value already exists',
                statusCode: 409,
                details: { field: prismaError.meta?.target }
            };
            res.status(409).json(errorResponse);
            return;
        }
        // Record not found
        if (prismaError.code === 'P2025') {
            const errorResponse = {
                error: 'Record not found',
                statusCode: 404
            };
            res.status(404).json(errorResponse);
            return;
        }
        // Foreign key constraint failed
        if (prismaError.code === 'P2003') {
            const errorResponse = {
                error: 'Related record not found',
                statusCode: 400,
                details: { field: prismaError.meta?.field_name }
            };
            res.status(400).json(errorResponse);
            return;
        }
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const errorResponse = {
            error: 'Invalid token',
            statusCode: 401
        };
        res.status(401).json(errorResponse);
        return;
    }
    if (err.name === 'TokenExpiredError') {
        const errorResponse = {
            error: 'Token expired',
            statusCode: 401
        };
        res.status(401).json(errorResponse);
        return;
    }
    // Default error
    const errorResponse = {
        error: err.message || 'Internal server error',
        statusCode: 500
    };
    res.status(500).json(errorResponse);
};
exports.errorHandler = errorHandler;
