"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.badgeUnlockSchema = exports.marketPreferenceSchema = exports.userLoginSchema = exports.userRegistrationSchema = exports.shoppingListItemSchema = exports.shoppingListSchema = exports.familySchema = exports.goalSchema = exports.bloodGlucoseSchema = void 0;
const zod_1 = require("zod");
// Blood Glucose Reading Schema
exports.bloodGlucoseSchema = zod_1.z.object({
    value: zod_1.z.number().min(20).max(600), // mg/dL typical range
    mealBefore: zod_1.z.boolean().optional(),
    activity: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    photoUrl: zod_1.z.string().url().optional()
});
// Diabetes Goal Schema
exports.goalSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().optional(),
    targetValue: zod_1.z.number().min(1),
    currentValue: zod_1.z.number().min(0).optional()
});
// Family Schema
exports.familySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100)
});
// Shopping List Schema
exports.shoppingListSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100)
});
// Shopping List Item Schema
exports.shoppingListItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    quantity: zod_1.z.number().min(1),
    unit: zod_1.z.string().min(1).max(50),
    checked: zod_1.z.boolean().optional()
});
// User Registration Schema
exports.userRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    username: zod_1.z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional()
});
// User Login Schema
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
// Market Preference Schema
exports.marketPreferenceSchema = zod_1.z.object({
    marketId: zod_1.z.string(),
    frequency: zod_1.z.enum(['weekly', 'biweekly', 'monthly']),
    preferredDays: zod_1.z.string() // JSON string of days array
});
// Badge Unlock Schema
exports.badgeUnlockSchema = zod_1.z.object({
    badgeId: zod_1.z.string()
});
// Validation middleware helper
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            else {
                res.status(400).json({ error: 'Invalid request data' });
            }
        }
    };
};
exports.validate = validate;
