"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../schemas/validation");
const firebase_1 = require("../utils/firebase");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
// POST /register - Create new user with Firebase Authentication
router.post('/register', (0, validation_1.validate)(validation_1.userRegistrationSchema), async (req, res) => {
    const firebaseUid = req.firebaseUid;
    try {
        const { email, password, username, firstName, lastName } = req.body;
        // Check if user already exists in database
        const existingUser = await server_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            logger_1.default.warn('Registration failed - user already exists', { email, username });
            res.status(400).json({ error: 'Email or username already exists' });
            return;
        }
        // Check if user exists in Firebase
        const firebaseUser = await (0, firebase_1.getUserByEmail)(email);
        if (firebaseUser) {
            logger_1.default.warn('Registration failed - Firebase user already exists', { email });
            res.status(400).json({ error: 'Email already registered in Firebase' });
            return;
        }
        // Create Firebase user
        logger_1.default.debug('Creating Firebase user', { email });
        const newFirebaseUser = await (0, firebase_1.createUser)(email, password, username);
        logger_1.default.info('Firebase user created', { firebaseUid: newFirebaseUser.uid, email });
        // Create user in database (keep local cuid; store Firebase UID mapping)
        const user = await server_1.prisma.user.create({
            data: {
                email,
                username,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                password: '', // Not used with Firebase auth, but keeping field for compatibility
                firebaseUid: newFirebaseUser.uid
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                createdAt: true
            }
        });
        logger_1.default.info('User registered successfully', { userId: user.id, email, username, firebaseUid: newFirebaseUser.uid });
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    }
    catch (error) {
        logger_1.default.error('Registration error', { email: req.body.email, error: error?.message, code: error?.code });
        // Firebase-specific errors
        if (error.code === 'auth/email-already-exists') {
            res.status(400).json({ error: 'Email already registered' });
        }
        else if (error.code === 'auth/invalid-email') {
            res.status(400).json({ error: 'Invalid email address' });
        }
        else if (error.code === 'auth/weak-password') {
            res.status(400).json({ error: 'Password is too weak (min 6 characters)' });
        }
        else if (error.code === 'auth/configuration-not-found') {
            res.status(500).json({
                error: 'Firebase Auth not configured',
                details: 'Email/Password authentication is not enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.'
            });
        }
        else if (error.code === 'P2002') {
            res.status(400).json({ error: 'Username already taken' });
        }
        else {
            res.status(500).json({ error: 'Failed to register user', details: error.message });
        }
    }
});
// POST /login - Authenticate with Firebase and return ID token
router.post('/login', (0, validation_1.validate)(validation_1.userLoginSchema), async (req, res) => {
    try {
        // Login is handled by Firebase Client SDK; backend does not issue local JWTs.
        res.status(200).json({
            message: 'Use Firebase Client SDK to sign in and get ID token',
            docs: 'https://firebase.google.com/docs/auth/web/password-auth',
            note: 'Send Firebase ID token in Authorization: Bearer <token>'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process login', details: error?.message });
    }
});
// GET /me - Get current user info (requires Firebase authentication)
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        logger_1.default.debug('Fetching user profile', { userId });
        const user = await server_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            logger_1.default.warn('User profile not found', { userId });
            res.status(404).json({ error: 'User not found' });
            return;
        }
        logger_1.default.debug('User profile retrieved', { userId, email: user.email });
        res.json(user);
    }
    catch (error) {
        logger_1.default.error('Error fetching user profile', { error: error?.message });
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});
// POST /logout - Mock logout endpoint
// Real logout happens on client by discarding the ID token
router.post('/logout', auth_1.authMiddleware, async (req, res) => {
    logger_1.default.info('User logout', { userId: req.userId, email: req.email });
    res.json({ message: 'Logged out successfully (discard token on client)' });
});
exports.default = router;
