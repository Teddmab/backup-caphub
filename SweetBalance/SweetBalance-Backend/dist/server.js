"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const logger_1 = __importDefault(require("./utils/logger"));
const firebase_1 = require("./utils/firebase");
const glucose_routes_1 = __importDefault(require("./routes/glucose.routes"));
const family_routes_1 = __importDefault(require("./routes/family.routes"));
const shopping_routes_1 = __importDefault(require("./routes/shopping.routes"));
const goals_routes_1 = __importDefault(require("./routes/goals.routes"));
const markets_routes_1 = __importDefault(require("./routes/markets.routes"));
const badges_routes_1 = __importDefault(require("./routes/badges.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const swagger_1 = require("./swagger");
const errorHandler_1 = require("./middleware/errorHandler");
const env = process.env.NODE_ENV || 'development';
dotenv_1.default.config({ path: '.env' });
dotenv_1.default.config({ path: `.env.${env}`, override: true });
dotenv_1.default.config({ path: '.env.local', override: true });
logger_1.default.info(`🚀 Server starting`, { environment: env, nodeVersion: process.version });
const app = (0, express_1.default)();
// Initialize Firebase
try {
    (0, firebase_1.initializeFirebase)();
    logger_1.default.info('✅ Firebase initialized successfully');
}
catch (error) {
    logger_1.default.error('⚠️ Firebase initialization failed', { error: error.message });
    logger_1.default.warn('Auth endpoints will not work. See docs/FIREBASE_CONFIG_CHECKLIST.md');
}
// Initialize Prisma with adapter for v7
const pool = new pg_1.default.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({ adapter });
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API docs
(0, swagger_1.setupSwagger)(app);
// Health check route
app.get('/health', (req, res) => {
    logger_1.default.debug('Health check request');
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/glucose', glucose_routes_1.default);
app.use('/api/v1/family', family_routes_1.default);
app.use('/api/v1/shopping', shopping_routes_1.default);
app.use('/api/v1/goals', goals_routes_1.default);
app.use('/api/v1/markets', markets_routes_1.default);
app.use('/api/v1/badges', badges_routes_1.default);
// Error handler middleware (must be after all routes)
app.use(errorHandler_1.errorHandler);
// Start server
const server = app.listen(PORT, () => {
    logger_1.default.info(`🎉 Server ready`, { port: PORT, url: `http://localhost:${PORT}` });
    logger_1.default.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger_1.default.info('SIGTERM received, shutting down gracefully...');
    await exports.prisma.$disconnect();
    server.close(() => {
        logger_1.default.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    logger_1.default.info('SIGINT received, shutting down gracefully...');
    await exports.prisma.$disconnect();
    server.close(() => {
        logger_1.default.info('Server closed');
        process.exit(0);
    });
});
exports.default = app;
