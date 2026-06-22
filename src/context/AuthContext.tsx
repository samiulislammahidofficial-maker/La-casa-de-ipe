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
    await logOut();
    setUserData(null);
    setNeedsRegistration(false);
    setIsAdminSession(false);
    sessionStorage.removeItem("adminSession");
  };

  const refreshUserData = async () => {
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
