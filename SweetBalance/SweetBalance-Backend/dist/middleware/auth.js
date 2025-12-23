"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_1 = require("../utils/firebase");
const server_1 = require("../server");
const logger_1 = __importDefault(require("../utils/logger"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger_1.default.warn('Auth attempt without token', { path: req.path, method: req.method });
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            logger_1.default.warn('Auth attempt with malformed bearer token', { path: req.path });
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        // Verify Firebase ID token
        const decodedToken = await (0, firebase_1.verifyIdToken)(token);
        logger_1.default.debug('Token verified', { firebaseUid: decodedToken.uid, email: decodedToken.email });
        req.firebaseUid = decodedToken.uid;
        req.email = decodedToken.email;
        // Map Firebase UID to local user id; create or link if missing
        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email || undefined;
        let user = await server_1.prisma.user.findUnique({ where: { firebaseUid } });
        if (!user && email) {
            // If a user exists with this email, link the firebaseUid
            const existingByEmail = await server_1.prisma.user.findUnique({ where: { email } });
            if (existingByEmail) {
                logger_1.default.info('Linking Firebase UID to existing user', { firebaseUid, userId: existingByEmail.id });
                user = await server_1.prisma.user.update({
                    where: { id: existingByEmail.id },
                    data: { firebaseUid }
                });
            }
        }
        if (!user) {
            // Auto-provision minimal user profile using Firebase claims
            const baseUsername = (email ? email.split('@')[0] : `user_${firebaseUid.slice(0, 6)}`);
            let username = baseUsername;
            let counter = 0;
            while (counter < 5) {
                const exists = await server_1.prisma.user.findUnique({ where: { username } }).catch(() => null);
                if (!exists)
                    break;
                counter += 1;
                username = `${baseUsername}${counter}`;
            }
            logger_1.default.info('Auto-provisioning new user from Firebase', { firebaseUid, email, username });
            user = await server_1.prisma.user.create({
                data: {
                    email: email || `${firebaseUid}@example.local`,
                    username,
                    password: '',
                    firebaseUid
                }
            });
        }
        // Attach local user id for downstream handlers
        req.userId = user.id;
        logger_1.default.debug('Auth middleware complete', { userId: user.id, path: req.path });
        next();
    }
    catch (error) {
        logger_1.default.error('Auth middleware error', { error: error?.message, path: req.path });
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
