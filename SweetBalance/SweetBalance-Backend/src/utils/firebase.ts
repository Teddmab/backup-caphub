import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

export const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if running in production (Vercel/Railway) with env vars
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    // Initialize with environment variables
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Initialize with JSON string (for CI/CD pipelines)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Development: look for service account file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
      path.join(process.cwd(), 'serviceAccountKey.json');

    try {
      // Use fs.readFileSync instead of require() for better path resolution
      const fileContent = fs.readFileSync(serviceAccountPath, 'utf-8');
      const serviceAccount = JSON.parse(fileContent);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log(`✅ Firebase initialized successfully from: ${serviceAccountPath}`);
    } catch (error: any) {
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

export const getFirebaseAuth = (): admin.auth.Auth => {
  const app = initializeFirebase();
  return app.auth();
};

export const verifyIdToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  const auth = getFirebaseAuth();
  return auth.verifyIdToken(token);
};

export const createUser = async (email: string, password: string, displayName?: string) => {
  const auth = getFirebaseAuth();
  return auth.createUser({
    email,
    password,
    displayName: displayName || email.split('@')[0]
  });
};

export const getUserByEmail = async (email: string) => {
  const auth = getFirebaseAuth();
  return auth.getUserByEmail(email).catch((error) => {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  });
};

export const deleteUser = async (uid: string) => {
  const auth = getFirebaseAuth();
  return auth.deleteUser(uid);
};
