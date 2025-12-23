import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Blood Glucose Reading Schema
export const bloodGlucoseSchema = z.object({
  value: z.number().min(20).max(600), // mg/dL typical range
  mealBefore: z.boolean().optional(),
  activity: z.string().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional()
});

// Diabetes Goal Schema
export const goalSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  targetValue: z.number().min(1),
  currentValue: z.number().min(0).optional()
});

// Family Schema
export const familySchema = z.object({
  name: z.string().min(2).max(100)
});

// Shopping List Schema
export const shoppingListSchema = z.object({
  title: z.string().min(1).max(100)
});

// Shopping List Item Schema
export const shoppingListItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().min(1),
  unit: z.string().min(1).max(50),
  checked: z.boolean().optional()
});

// User Registration Schema
export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional()
});

// User Login Schema
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Market Preference Schema
export const marketPreferenceSchema = z.object({
  marketId: z.string(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  preferredDays: z.string() // JSON string of days array
});

// Badge Unlock Schema
export const badgeUnlockSchema = z.object({
  badgeId: z.string()
});

// Validation middleware helper
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        res.status(400).json({ error: 'Invalid request data' });
      }
    }
  };
};
