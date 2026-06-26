import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClipboardList, ChevronDown, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  signUpWithStudentId,
  createUserDocument,
  addEventToUser,
  studentIdToEmail,
} from "../lib/firebaseUtils";

interface FormData {
  department: "IPE" | "Others";
  customDepartment: string;
  name: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  contactNo: string;
  hallName: string;
}

interface RegistrationFormProps {
  onViewChange: (view: string) => void;
}

export default function RegistrationForm({ onViewChange }: RegistrationFormProps) {
  const { firebaseUser, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      department: "IPE",
      customDepartment: "",
      name: "",
      studentId: "",
      password: "",
      confirmPassword: "",
      contactNo: "",
      hallName: "",
    },
  });

  const selectedDepartment = watch("department");
  const passwordValue = watch("password");

  // Auto-fill name from Google Auth if available
  useEffect(() => {
    if (firebaseUser?.displayName) {
      setValue("name", firebaseUser.displayName);
    }
    if (firebaseUser?.email && !firebaseUser.email.endsWith("@lacasadeipe.app")) {
      // Google user — don't prefill studentId
    }
  }, [firebaseUser, setValue]);

  const onSubmit = async (data: FormData) => {
    setGlobalError(null);
    setLoading(true);

    try {
      const department = data.department === "Others" ? data.customDepartment.trim() : "IPE";
      const paymentStatus = data.department === "IPE" ? "free" : "pending";
      const email = studentIdToEmail(data.studentId.trim());

      let uid: string;

      if (firebaseUser) {
        // User is already logged in via Google — just create the Firestore doc
        uid = firebaseUser.uid;

        // If they provided a password, create an email/password link too
        // (We can skip this for Google users to avoid complexity)
      } else {
        // Manual sign-up: create Firebase Auth account with Student ID pseudo-email
        const credential = await signUpWithStudentId(
          data.studentId.trim(),
          data.password,
          data.name.trim()
        );
        uid = credential.user.uid;
      }

      // Create user document in Firestore
      await createUserDocument(uid, {
        name: data.name.trim(),
        studentId: data.studentId.trim(),
        email: firebaseUser?.email || email,
        department,
        contactNo: data.contactNo.trim(),
        hallName: data.hallName.trim(),
        role: "user",
        paymentStatus,
        registered_events: ["The Bizz Seminar"],
      });

      // Auto-register for The Bizz Seminar
      await addEventToUser(uid, "The Bizz Seminar");

      // Refresh auth context
      await refreshUserData();

      // Route based on department
      if (data.department === "IPE") {
        onViewChange("registrationSuccess");
      } else {
        onViewChange("payment");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setGlobalError("This Student ID is already registered. Please log in instead.");
      } else if (err.code === "auth/weak-password") {
        setGlobalError("Password must be at least 6 characters long.");
      } else {
        setGlobalError(err.message || "Registration failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-brand-red glow-red-text mb-2">
            Registration
          </h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.3em]">
            Complete your operative profile
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="p-2.5 bg-brand-gold-bright/10 border border-brand-gold-bright/30 rounded-lg">
              <ClipboardList size={22} className="text-brand-gold-bright" />
            </div>
            <div>
              <h2 className="font-display text-xl text-white uppercase tracking-wider">
                Profile Setup
              </h2>
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                All fields required
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Department Selection */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-3 block">
                Department
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 border rounded-xl cursor-pointer transition-all duration-300 font-mono text-sm uppercase tracking-widest ${
                    selectedDepartment === "IPE"
                      ? "border-brand-red bg-brand-red/15 text-brand-red-light shadow-[0_0_20px_rgba(139,0,0,0.15)]"
                      : "border-white/10 text-gray-400 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    value="IPE"
                    {...register("department")}
                    className="sr-only"
                  />
                  <CheckCircle
                    size={16}
                    className={selectedDepartment === "IPE" ? "opacity-100" : "opacity-0"}
                  />
                  IPE
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 border rounded-xl cursor-pointer transition-all duration-300 font-mono text-sm uppercase tracking-widest ${
                    selectedDepartment === "Others"
                      ? "border-brand-gold-bright bg-brand-gold-bright/10 text-brand-gold-bright shadow-[0_0_20px_rgba(233,195,73,0.15)]"
                      : "border-white/10 text-gray-400 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    value="Others"
                    {...register("department")}
                    className="sr-only"
                  />
                  <CheckCircle
                    size={16}
                    className={selectedDepartment === "Others" ? "opacity-100" : "opacity-0"}
                  />
                  Others
                </label>
              </div>

              {/* Dynamic department name input */}
              {selectedDepartment === "Others" && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                  <input
                    type="text"
                    placeholder="Enter your department name"
                    {...register("customDepartment", {
                      required: selectedDepartment === "Others" ? "Department name is required" : false,
                    })}
                    className="w-full bg-black/40 border border-brand-gold-bright/30 focus:border-brand-gold-bright/60 focus:shadow-[0_0_20px_rgba(233,195,73,0.1)] outline-none rounded-lg px-4 py-3 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                  />
                  {errors.customDepartment && (
                    <p className="text-red-400 font-mono text-[10px] mt-1">
                      {errors.customDepartment.message}
                    </p>
                  )}
                </div>
              )}

              {selectedDepartment === "IPE" && (
                <p className="font-mono text-[10px] text-green-400/70 mt-2 flex items-center gap-1.5">
                  <CheckCircle size={10} /> Registration is free for IPE students
                </p>
              )}
              {selectedDepartment === "Others" && (
                <p className="font-mono text-[10px] text-brand-gold-bright/70 mt-2">
                  ⚡ Payment required for non-IPE participants
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
                className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
              />
              {errors.name && (
                <p className="text-red-400 font-mono text-[10px] mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Student ID */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Student ID No
              </label>
              <input
                type="text"
                placeholder="e.g. 2408001"
                {...register("studentId", {
                  required: "Student ID is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Student ID must contain only numbers",
                  },
                })}
                className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
              />
              {errors.studentId && (
                <p className="text-red-400 font-mono text-[10px] mt-1">{errors.studentId.message}</p>
              )}
            </div>

            {/* Password — only show if not already logged in via Google */}
            {!firebaseUser && (
              <>
                <div>
                  <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                    Set Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    {...register("password", {
                      required: !firebaseUser ? "Password is required" : false,
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                  />
                  {errors.password && (
                    <p className="text-red-400 font-mono text-[10px] mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    {...register("confirmPassword", {
                      required: !firebaseUser ? "Please confirm your password" : false,
                      validate: (val) =>
                        !firebaseUser && val !== passwordValue
                          ? "Passwords do not match"
                          : true,
                    })}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 font-mono text-[10px] mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Contact No */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Contact No
              </label>
              <input
                type="tel"
                placeholder="+880 1XXXXXXXXX"
                {...register("contactNo", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[\+]?[\d\s\-]{7,15}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
              />
              {errors.contactNo && (
                <p className="text-red-400 font-mono text-[10px] mt-1">
                  {errors.contactNo.message}
                </p>
              )}
            </div>

            {/* Hall Name */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Hall Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rashid Hall"
                {...register("hallName", { required: "Hall name is required" })}
                className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 outline-none rounded-lg px-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
              />
              {errors.hallName && (
                <p className="text-red-400 font-mono text-[10px] mt-1">
                  {errors.hallName.message}
                </p>
              )}
            </div>

            {/* Global Error */}
            {globalError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="font-mono text-xs text-red-300 leading-relaxed">{globalError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-red hover:bg-red-800 text-white font-display text-lg uppercase tracking-widest transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(139,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 border border-red-900"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-gray-500">
              Already registered?{" "}
              <button
                onClick={() => onViewChange("login")}
                className="text-brand-gold-bright hover:text-yellow-400 underline underline-offset-4 transition-colors"
              >
                Login Here
              </button>
            </p>
          </div>
        </div>

        {/* Back to hub */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onViewChange("hub")}
            className="font-mono text-xs text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors"
          >
            ← Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}
