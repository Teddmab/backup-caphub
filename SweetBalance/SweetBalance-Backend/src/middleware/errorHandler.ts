import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface ErrorResponse {
  error: string;
  statusCode: number;
  details?: any;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const errorResponse: ErrorResponse = {
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
    const prismaError = err as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      const errorResponse: ErrorResponse = {
        error: 'A record with this value already exists',
        statusCode: 409,
        details: { field: prismaError.meta?.target }
      };
      res.status(409).json(errorResponse);
      return;
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      const errorResponse: ErrorResponse = {
        error: 'Record not found',
        statusCode: 404
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Foreign key constraint failed
    if (prismaError.code === 'P2003') {
      const errorResponse: ErrorResponse = {
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
    const errorResponse: ErrorResponse = {
      error: 'Invalid token',
      statusCode: 401
    };
    res.status(401).json(errorResponse);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    const errorResponse: ErrorResponse = {
      error: 'Token expired',
      statusCode: 401
    };
    res.status(401).json(errorResponse);
    return;
  }

  // Default error
  const errorResponse: ErrorResponse = {
    error: err.message || 'Internal server error',
    statusCode: 500
  };

  res.status(500).json(errorResponse);
};
