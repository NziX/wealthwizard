// Firebase Configuration for WealthWizard
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDix2mPUiFhMj3T7M0nIVmOMhVfcz9jTlg",
  authDomain: "wealthwizard-58088.firebaseapp.com",
  projectId: "wealthwizard-58088",
  storageBucket: "wealthwizard-58088.firebasestorage.app",
  messagingSenderId: "212723611405",
  appId: "1:212723611405:web:60e86c20a0033c4b3c2244",
  measurementId: "G-XYYCTR8DTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
