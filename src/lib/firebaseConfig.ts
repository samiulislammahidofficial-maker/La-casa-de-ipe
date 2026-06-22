// Real Firebase Configuration & Initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrLpdJheDImy2Mo14pac3eY3q4UgXYsX4",
  authDomain: "rising-city-db34d.firebaseapp.com",
  projectId: "rising-city-db34d",
  storageBucket: "rising-city-db34d.firebasestorage.app",
  messagingSenderId: "135083594461",
  appId: "1:135083594461:web:b8103561e8306329538134",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firestore — using the custom database ID from firebase-applet-config.json
export const db = getFirestore(app, "ai-studio-a4d06090-214f-4f6e-937c-25fafad520f4");

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
