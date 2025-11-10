import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "studentlibrary.firebaseapp.com",
  projectId: "studentlibrary",
  storageBucket: "studentlibrary.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const authInstance = auth();
const firestoreInstance = firestore();
const storageInstance = storage();

export { app, authInstance, firestoreInstance, storageInstance };
export default app;
