import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../utils/firebase';
import { prisma } from '../server';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  firebaseUid?: string;
  email?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeaderRaw = req.headers.authorization || '';
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

    // Try to extract token in a robust, case-insensitive way
    const match = authHeader.match(/^\s*Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim()?.replace(/^"|"$/g, '');

    if (!token) {
      logger.warn('Auth attempt without or malformed bearer token', {
        path: req.path,
        method: req.method,
        headerSample: authHeader?.slice(0, 20)
      });
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Basic sanity check: JWTs have three sections separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      logger.warn('Auth attempt with non-JWT token format', {
        path: req.path,
        method: req.method,
        tokenLength: token.length
      });
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(token);
    logger.debug('Token verified', { firebaseUid: decodedToken.uid, email: decodedToken.email });
    req.firebaseUid = decodedToken.uid;
    req.email = decodedToken.email;

    // Map Firebase UID to local user id; create or link if missing
    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email || undefined;

    let user = await prisma.user.findUnique({ where: { firebaseUid } });

    if (!user && email) {
      // If a user exists with this email, link the firebaseUid
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        logger.info('Linking Firebase UID to existing user', { firebaseUid, userId: existingByEmail.id });
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { firebaseUid }
        });
      }
    }

    if (!user) {
      // Auto-provision minimal user profile using Firebase claims
      const baseUsername = (email ? email.split('@')[0] : `user_${firebaseUid.slice(0,6)}`);
      let username = baseUsername;
      let counter = 0;
      while (counter < 5) {
        const exists = await prisma.user.findUnique({ where: { username } }).catch(() => null);
        if (!exists) break;
        counter += 1;
        username = `${baseUsername}${counter}`;
      }

      logger.info('Auto-provisioning new user from Firebase', { firebaseUid, email, username });
      user = await prisma.user.create({
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
    logger.debug('Auth middleware complete', { userId: user.id, path: req.path });
    next();
  } catch (error: any) {
    logger.error('Auth middleware error', {
      error: error?.message,
      code: error?.code || error?.errorInfo?.code,
      path: req.path
    });
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};
