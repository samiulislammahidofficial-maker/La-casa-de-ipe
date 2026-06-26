// Real Firebase Configuration & Initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDn9z0DrTvsLTRcpLYEZgvAPqa3Jo8Fr8A",
  authDomain: "la-casa-de-ipe.firebaseapp.com",
  projectId: "la-casa-de-ipe",
  storageBucket: "la-casa-de-ipe.firebasestorage.app",
  messagingSenderId: "945197115307",
  appId: "1:945197115307:web:2977167fac4050dc73d4ee",
  measurementId: "G-PS91C9E55L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firestore — default database for production project
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
