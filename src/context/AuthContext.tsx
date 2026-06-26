import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  onAuthStateChanged,
  getUserDocument,
  logOut,
  type UserData,
} from "../lib/firebaseUtils";

// ─── Types ────────────────────────────────────────────────
interface AuthContextType {
  /** Firebase Auth user object */
  firebaseUser: FirebaseUser | null;
  /** Firestore user profile data */
  userData: UserData | null;
  /** Whether the initial auth check is loading */
  isLoading: boolean;
  /** Whether the user needs to complete registration */
  needsRegistration: boolean;
  /** Sign out */
  logout: () => Promise<void>;
  /** Refresh user data from Firestore */
  refreshUserData: () => Promise<void>;
  /** Admin session state (hardcoded login, separate from Firebase) */
  isAdminSession: boolean;
  /** Set admin session */
  setAdminSession: (val: boolean) => void;
  /** Log in as a demo user to bypass Firebase configuration or whitelist issues */
  loginAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(() => {
    return sessionStorage.getItem("adminSession") === "true";
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    if (sessionStorage.getItem("demoSession") === "true") {
      setFirebaseUser({
        uid: "demo-user-123",
        email: "demo.operative@lacasadeipe.app",
        displayName: "Demo Operative",
        emailVerified: true,
      } as any);
      setUserData({
        name: "Demo Operative",
        studentId: "2408000",
        email: "demo.operative@lacasadeipe.app",
        department: "IPE",
        contactNo: "+880 1700000000",
        hallName: "Rashid Hall",
        role: "user",
        paymentStatus: "confirmed",
        registered_events: ["The Bizz Seminar"],
        createdAt: new Date(),
      });
      setNeedsRegistration(false);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const doc = await getUserDocument(user.uid);
          if (doc) {
            setUserData(doc);
            setNeedsRegistration(false);
          } else {
            // User exists in Firebase Auth but has no Firestore profile
            setUserData(null);
            setNeedsRegistration(true);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUserData(null);
          setNeedsRegistration(true);
        }
      } else {
        setUserData(null);
        setNeedsRegistration(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (sessionStorage.getItem("demoSession") === "true") {
      sessionStorage.removeItem("demoSession");
      setFirebaseUser(null);
      setUserData(null);
      setNeedsRegistration(false);
      setIsAdminSession(false);
      sessionStorage.removeItem("adminSession");
    } else {
      try {
        await logOut();
      } catch (err) {
        console.error("Firebase logout failed, clearing local state:", err);
      }
      setUserData(null);
      setNeedsRegistration(false);
      setIsAdminSession(false);
      sessionStorage.removeItem("adminSession");
    }
  };

  const refreshUserData = async () => {
    if (sessionStorage.getItem("demoSession") === "true") return;
    if (firebaseUser) {
      const doc = await getUserDocument(firebaseUser.uid);
      if (doc) {
        setUserData(doc);
        setNeedsRegistration(false);
      }
    }
  };

  const handleSetAdminSession = (val: boolean) => {
    setIsAdminSession(val);
    if (val) {
      sessionStorage.setItem("adminSession", "true");
    } else {
      sessionStorage.removeItem("adminSession");
    }
  };

  const loginAsDemoUser = () => {
    sessionStorage.setItem("demoSession", "true");
    setFirebaseUser({
      uid: "demo-user-123",
      email: "demo.operative@lacasadeipe.app",
      displayName: "Demo Operative",
      emailVerified: true,
    } as any);
    setUserData({
      name: "Demo Operative",
      studentId: "2408000",
      email: "demo.operative@lacasadeipe.app",
      department: "IPE",
      contactNo: "+880 1700000000",
      hallName: "Rashid Hall",
      role: "user",
      paymentStatus: "confirmed",
      registered_events: ["The Bizz Seminar"],
      createdAt: new Date(),
    });
    setNeedsRegistration(false);
    // Force a small tick/timeout to let views react to updated state or redirect
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        isLoading,
        needsRegistration,
        logout,
        refreshUserData,
        isAdminSession,
        setAdminSession: handleSetAdminSession,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
