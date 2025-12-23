"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserByEmail = exports.createUser = exports.verifyIdToken = exports.getFirebaseAuth = exports.initializeFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize Firebase Admin SDK
let firebaseApp;
const initializeFirebase = () => {
    if (firebaseApp) {
        return firebaseApp;
    }
    // Check if running in production (Vercel/Railway) with env vars
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        // Initialize with environment variables
        firebaseApp = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            })
        });
    }
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        // Initialize with JSON string (for CI/CD pipelines)
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        firebaseApp = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        });
    }
    else {
        // Development: look for service account file
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
            path_1.default.join(process.cwd(), 'serviceAccountKey.json');
        try {
            // Use fs.readFileSync instead of require() for better path resolution
            const fileContent = fs_1.default.readFileSync(serviceAccountPath, 'utf-8');
            const serviceAccount = JSON.parse(fileContent);
            firebaseApp = firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccount)
            });
            console.log(`✅ Firebase initialized successfully from: ${serviceAccountPath}`);
        }
        catch (error) {
            console.error('Firebase initialization failed. Please provide one of:');
            console.error('1. Environment variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
            console.error('2. JSON string: FIREBASE_SERVICE_ACCOUNT_JSON');
            console.error('3. File at: FIREBASE_SERVICE_ACCOUNT_PATH or ./serviceAccountKey.json');
            console.error(`   (Checked: ${serviceAccountPath})`);
            console.error(`   Error: ${error.message}`);
            throw new Error('Firebase configuration not found');
        }
    }
    return firebaseApp;
};
exports.initializeFirebase = initializeFirebase;
const getFirebaseAuth = () => {
    const app = (0, exports.initializeFirebase)();
    return app.auth();
};
exports.getFirebaseAuth = getFirebaseAuth;
const verifyIdToken = async (token) => {
    const auth = (0, exports.getFirebaseAuth)();
    return auth.verifyIdToken(token);
};
exports.verifyIdToken = verifyIdToken;
const createUser = async (email, password, displayName) => {
    const auth = (0, exports.getFirebaseAuth)();
    return auth.createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0]
    });
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    const auth = (0, exports.getFirebaseAuth)();
    return auth.getUserByEmail(email).catch((error) => {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        throw error;
    });
};
exports.getUserByEmail = getUserByEmail;
const deleteUser = async (uid) => {
    const auth = (0, exports.getFirebaseAuth)();
    return auth.deleteUser(uid);
};
exports.deleteUser = deleteUser;
