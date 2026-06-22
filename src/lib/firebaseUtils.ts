// Firebase Utilities — Real Firebase SDK Implementation
// Provides authentication and Firestore operations for the event portal.

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
  type Unsubscribe,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebaseConfig";

// ─── Constants ────────────────────────────────────────────
const PSEUDO_EMAIL_DOMAIN = "lacasadeipe.app";

// ─── Helper: Student ID ↔ Pseudo-email mapping ───────────
export function studentIdToEmail(studentId: string): string {
  return `${studentId.trim()}@${PSEUDO_EMAIL_DOMAIN}`;
}

export function emailToStudentId(email: string): string {
  if (email.endsWith(`@${PSEUDO_EMAIL_DOMAIN}`)) {
    return email.replace(`@${PSEUDO_EMAIL_DOMAIN}`, "");
  }
  return email;
}

// ─── User Data Types ──────────────────────────────────────
export interface UserData {
  name: string;
  studentId: string;
  email: string;
  department: string;
  contactNo: string;
  hallName: string;
  role: "user" | "admin";
  paymentStatus: "free" | "pending" | "submitted" | "confirmed";
  registered_events: string[];
  createdAt: any;
}

// ─── Authentication Functions ─────────────────────────────

/** Sign in with Student ID + Password (maps to pseudo-email) */
export async function signInWithStudentId(studentId: string, password: string) {
  const email = studentIdToEmail(studentId);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential;
}

/** Sign up with Student ID + Password (creates Firebase Auth account) */
export async function signUpWithStudentId(studentId: string, password: string, displayName?: string) {
  const email = studentIdToEmail(studentId);
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
}

/** Sign in with Google popup */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result;
}

/** Sign out */
export async function logOut() {
  await firebaseSignOut(auth);
}

/** Listen to auth state changes */
export function onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return firebaseOnAuthStateChanged(auth, callback);
}

// ─── Firestore: Users Collection ──────────────────────────

/** Create or update a user document in Firestore */
export async function createUserDocument(uid: string, data: Partial<UserData>) {
  const userRef = doc(db, "users", uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    // Merge update
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new
    await setDoc(userRef, {
      name: data.name || "",
      studentId: data.studentId || "",
      email: data.email || "",
      department: data.department || "",
      contactNo: data.contactNo || "",
      hallName: data.hallName || "",
      role: "user",
      paymentStatus: data.paymentStatus || "free",
      registered_events: data.registered_events || [],
      createdAt: serverTimestamp(),
      ...data,
    });
  }
}

/** Get a single user document by UID */
export async function getUserDocument(uid: string): Promise<UserData | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserData;
  }
  return null;
}

/** Check if user document exists */
export async function userDocumentExists(uid: string): Promise<boolean> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists();
}

/** Get all users (admin use) */
export async function getAllUsers(): Promise<(UserData & { id: string })[]> {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as UserData),
  }));
}

/** Real-time listener for all users (admin dashboard) */
export function onUsersSnapshot(
  callback: (users: (UserData & { id: string })[]) => void
): Unsubscribe {
  const usersRef = collection(db, "users");
  return onSnapshot(usersRef, (snap: QuerySnapshot<DocumentData>) => {
    const users = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as UserData),
    }));
    callback(users);
  });
}

/** Update user payment status (admin action) */
export async function updatePaymentStatus(
  uid: string,
  status: "free" | "pending" | "submitted" | "confirmed"
) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    paymentStatus: status,
    updatedAt: serverTimestamp(),
  });
}

/** Add event to user's registered_events array */
export async function addEventToUser(uid: string, eventName: string) {
  const userData = await getUserDocument(uid);
  if (userData) {
    const events = userData.registered_events || [];
    if (!events.includes(eventName)) {
      events.push(eventName);
      await updateDoc(doc(db, "users", uid), {
        registered_events: events,
        updatedAt: serverTimestamp(),
      });
    }
  }
}

// ─── Firestore: Registrations Collection (legacy compat) ──

/** Register for an event (creates a registration document) */
export async function registerForEvent(userId: string, eventName: string) {
  const regsRef = collection(db, "registrations");
  await addDoc(regsRef, {
    userId,
    eventName,
    createdAt: serverTimestamp(),
  });
}

/** Get registrations for a specific user */
export async function getUserRegistrations(userId: string) {
  const regsRef = collection(db, "registrations");
  const q = query(regsRef, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ─── Re-exports for backward compatibility ────────────────
export { auth, db } from "./firebaseConfig";
