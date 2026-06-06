import { useState, useEffect } from "react";
import { User, LogOut, X } from "lucide-react";
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "../lib/firebaseUtils";
import SignUpForm from "./SignUpForm";

interface UserData {
  name: string;
  rollNumber: string;
}

interface Registration {
  id: string;
  eventName: string;
}

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch user profile data
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          }

          // Fetch user registrations
          const regQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid),
          );
          const regSnapshot = await getDocs(regQuery);
          const userRegs = regSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Registration[];
          setRegistrations(userRegs);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setRegistrations([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 animate-pulse bg-white/10 rounded-full"></div>
    );
  }

  if (!currentUser) {
    return (
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('request-login'))}
        className="bg-brand-red hover:bg-red-800 text-white font-display text-lg px-6 py-1.5 rounded glow-red uppercase tracking-wider transition-all active:scale-95 border border-red-900 border-b-red-950"
      >
        LOGIN
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border-2 border-brand-gold-bright flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] transition-colors"
      >
        <User size={20} className="text-brand-gold-bright" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-14 right-0 w-80 bg-[#1a1a1a] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] rounded-lg z-50 overflow-hidden font-body text-white">
            <div className="flex justify-between items-center bg-[#111] p-4 border-b border-white/10">
              <h3 className="font-display uppercase tracking-widest text-brand-gold-bright">
                Operative Profile
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Codename
                </div>
                <div className="font-mono text-lg">
                  {userData?.name || "Unknown"}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Roll Number
                </div>
                <div className="font-mono text-lg">
                  {userData?.rollNumber || "N/A"}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Registered Operations
                </div>
                {registrations.length > 0 ? (
                  <ul className="space-y-2">
                    {registrations.map((reg) => (
                      <li
                        key={reg.id}
                        className="font-mono text-sm bg-white/5 border border-white/10 p-2 rounded"
                      >
                        {reg.eventName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="font-mono text-sm text-gray-400 italic">
                    No operations assigned yet.
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 mt-4 text-brand-red text-sm font-mono uppercase tracking-widest hover:bg-brand-red/10 rounded transition-colors"
              >
                <LogOut size={16} /> Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
