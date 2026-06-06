import { useForm } from "react-hook-form";
import {
  auth,
  createUserDocument,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "../lib/firebaseUtils";
import { useState } from "react";

type SignUpFormData = {
  name?: string;
  department?: "IPE";
  batch?: "25";
  rollNumber?: string;
  hall?: string;
  contactNumber?: string;
  email: string;
  password?: string;
};

export default function SignUpForm({ onComplete }: { onComplete: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (!data.password) {
        throw new Error("Password is required.");
      }
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        onComplete();
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        const user = userCredential.user;

        const { password, ...firestoreData } = data;
        await createUserDocument(user.uid, firestoreData);
        onComplete();
      }
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setErrorMsg(
          "Email/Password authentication is not enabled. Please enable it in your Firebase Console under Auth > Sign-in method.",
        );
      } else {
        setErrorMsg(err.message || "Failed to authenticate");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAnon = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      await createUserDocument(user.uid, {
        name: "Guest User",
        email: "guest@example.com",
        role: "student",
      });
      onComplete();
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setErrorMsg(
          'Guest/Anonymous authentication is not enabled. Please enable "Anonymous" in your Firebase Console under Authentication > Sign-in method.',
        );
      } else {
        setErrorMsg(err.message || "Failed anonymous signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await createUserDocument(user.uid, {
        name: user.displayName || "Google User",
        email: user.email || "",
        role: "student",
      });
      onComplete();
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setErrorMsg(
          "Google authentication is not enabled. Please enable it in your Firebase Console under Auth > Sign-in method.",
        );
      } else {
        setErrorMsg(err.message || "Failed Google signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInFacebook = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await createUserDocument(user.uid, {
        name: user.displayName || "Facebook User",
        email: user.email || "",
        role: "student",
      });
      onComplete();
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setErrorMsg(
          "Facebook authentication is not enabled. Please enable it in your Firebase Console under Auth > Sign-in method.",
        );
      } else {
        setErrorMsg(err.message || "Failed Facebook signin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-[#1a1a1a] border border-brand-red/50 rounded-lg shadow-[0_0_20px_rgba(139,0,0,0.3)] text-white font-body">
      <h2 className="text-3xl font-display text-center uppercase mb-6 tracking-widest text-brand-gold-bright">
        {isLogin ? "Operative Login" : "Join the Heist"}
      </h2>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-sm font-mono text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                Operative Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none transition-colors"
                autoComplete="off"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                  Department
                </label>
                <select
                  {...register("department", { required: "Required" })}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white/80"
                >
                  <option value="IPE">IPE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                  Batch
                </label>
                <select
                  {...register("batch", { required: "Required" })}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white/80"
                >
                  <option value="25">25</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                Roll Number
              </label>
              <input
                {...register("rollNumber", {
                  required: "Required",
                  pattern: {
                    value: /^2508\d{3}$/,
                    message: "Must start with 2508 and be exactly 7 digits",
                  },
                })}
                className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
                placeholder="2508XXX"
                autoComplete="off"
              />
              {errors.rollNumber && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.rollNumber.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                Hall
              </label>
              <select
                {...register("hall", { required: "Required" })}
                className="w-full bg-[#111] border border-white/10 rounded px-3 py-2"
              >
                <option value="">Select Hall</option>
                <option value="Rashid Hall">Rashid Hall</option>
                <option value="Titumir Hall">Titumir Hall</option>
                <option value="Sher e bangla hall">Sher e bangla hall</option>
                <option value="Kazi Nazrul hall">Kazi Nazrul hall</option>
                <option value="Ahshanullah Hall">Ahshanullah Hall</option>
                <option value="Sony hall">Sony hall</option>
                <option value="Swadhinota hall">Swadhinota hall</option>
                <option value="Swahrawardy hall">Swahrawardy hall</option>
              </select>
              {errors.hall && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.hall.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                Contact Number
              </label>
              <input
                {...register("contactNumber", { required: "Required" })}
                className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
                autoComplete="off"
              />
              {errors.contactNumber && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email",
              },
            })}
            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
            autoComplete="email"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-brand-red text-white font-display uppercase tracking-wider rounded border border-red-800 hover:bg-red-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Decrypting..." : (isLogin ? "Enter Terminal" : "Register as Operative")}
        </button>

        <p className="text-center text-sm mt-4 text-gray-400">
          {isLogin ? "Need an access code? " : "Already an operative? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-brand-red hover:text-white transition-colors underline underline-offset-4"
          >
            {isLogin ? "Register Now" : "Login"}
          </button>
        </p>

      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-4">
          Alternative Entry
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={signInGoogle}
            disabled={loading}
            className="w-full py-2 bg-white/10 text-white border border-white/50 font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Google Access
          </button>
          <button
            type="button"
            onClick={signInFacebook}
            disabled={loading}
            className="w-full py-2 bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/50 font-mono text-sm uppercase tracking-widest hover:bg-[#1877F2] hover:text-white transition-colors"
          >
            Facebook Access
          </button>
          <button
            type="button"
            onClick={signInAnon}
            disabled={loading}
            className="w-full py-2 bg-white/5 text-gray-400 border border-white/10 font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Guest Override
          </button>
        </div>
      </div>
    </div>
  );
}
