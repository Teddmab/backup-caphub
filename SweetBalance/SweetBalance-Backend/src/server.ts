import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import logger from './utils/logger';
import { initializeFirebase } from './utils/firebase';
import glucoseRoutes from './routes/glucose.routes';
import familyRoutes from './routes/family.routes';
import shoppingRoutes from './routes/shopping.routes';
import goalsRoutes from './routes/goals.routes';
import marketsRoutes from './routes/markets.routes';
import badgesRoutes from './routes/badges.routes';
import authRoutes from './routes/auth.routes';
import { setupSwagger } from './swagger';
import { errorHandler } from './middleware/errorHandler';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: '.env' });
dotenv.config({ path: `.env.${env}`, override: true });
dotenv.config({ path: '.env.local', override: true });

logger.info(`🚀 Server starting`, { environment: env, nodeVersion: process.version });

const app = express();

// Initialize Firebase
try {
  initializeFirebase();
  logger.info('✅ Firebase initialized successfully');
} catch (error) {
  logger.error('⚠️ Firebase initialization failed', { error: (error as any).message });
  logger.warn('Auth endpoints will not work. See docs/FIREBASE_CONFIG_CHECKLIST.md');
}

// Initialize Prisma with adapter for v7
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API docs
setupSwagger(app);

// Health check route
app.get('/health', (req, res) => {
  logger.debug('Health check request');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/glucose', glucoseRoutes);
app.use('/api/v1/family', familyRoutes);
app.use('/api/v1/shopping', shoppingRoutes);
app.use('/api/v1/goals', goalsRoutes);
app.use('/api/v1/markets', marketsRoutes);
app.use('/api/v1/badges', badgesRoutes);

// Error handler middleware (must be after all routes)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🎉 Server ready`, { port: PORT, url: `http://localhost:${PORT}` });
  logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
