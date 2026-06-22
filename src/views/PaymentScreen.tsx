import { useState } from "react";
import { CreditCard, AlertTriangle, Loader2, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updatePaymentStatus } from "../lib/firebaseUtils";

interface PaymentScreenProps {
  onViewChange: (view: string) => void;
}

export default function PaymentScreen({ onViewChange }: PaymentScreenProps) {
  const { firebaseUser, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsPaid = async () => {
    if (!firebaseUser) return;
    setError(null);
    setLoading(true);

    try {
      await updatePaymentStatus(firebaseUser.uid, "submitted");
      await refreshUserData();
      setSubmitted(true);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to update payment status.");
    }

    setLoading(false);
  };

  const isAlreadySubmitted = userData?.paymentStatus === "submitted" || userData?.paymentStatus === "confirmed";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111]/90 backdrop-blur-xl border border-brand-gold-bright/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(233,195,73,0.1)]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="p-2.5 bg-brand-gold-bright/10 border border-brand-gold-bright/30 rounded-lg">
              <CreditCard size={22} className="text-brand-gold-bright" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                Payment Required
              </h2>
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                Bizcomp Seminar Registration Fee
              </p>
            </div>
          </div>

          {submitted || isAlreadySubmitted ? (
            /* Payment submitted state */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-brand-gold-bright/10 border border-brand-gold-bright/30 rounded-full flex items-center justify-center mb-6">
                <Clock size={36} className="text-brand-gold-bright" />
              </div>
              <h3 className="font-display text-2xl text-white uppercase tracking-wider mb-3">
                Payment Submitted
              </h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
                Your payment confirmation has been sent. An admin will verify your payment shortly.
                You'll receive full portal access once confirmed.
              </p>

              <div className="bg-brand-gold-bright/5 border border-brand-gold-bright/20 rounded-lg p-4 mb-6">
                <p className="font-mono text-xs text-brand-gold-bright uppercase tracking-widest">
                  Status: Awaiting Admin Verification
                </p>
              </div>

              <button
                onClick={() => onViewChange("hub")}
                className="w-full py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-mono text-sm uppercase tracking-widest transition-all rounded-xl"
              >
                Go to Portal
              </button>
            </div>
          ) : (
            /* Payment form */
            <>
              {/* Fee details */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Event</span>
                  <span className="font-mono text-sm text-white">Bizcomp Seminar</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Department</span>
                  <span className="font-mono text-sm text-brand-gold-bright">{userData?.department || "Others"}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Registration Fee</span>
                  <span className="font-display text-3xl text-brand-gold-bright">৳200</span>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="bg-brand-gold-bright/5 border border-brand-gold-bright/15 rounded-xl p-5 mb-6">
                <h4 className="font-mono text-xs text-brand-gold-bright uppercase tracking-widest mb-3 font-bold">
                  Payment Instructions
                </h4>
                <ol className="space-y-2 font-mono text-xs text-gray-300 list-decimal list-inside leading-relaxed">
                  <li>Send ৳200 to the designated bKash/Nagad number</li>
                  <li>Use your <strong className="text-white">Student ID</strong> as reference</li>
                  <li>Click "Confirm Payment" below after sending</li>
                  <li>Admin will verify and activate your access</li>
                </ol>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="font-mono text-xs text-red-300 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={handleMarkAsPaid}
                disabled={loading}
                className="w-full py-4 bg-brand-gold-bright hover:bg-yellow-500 text-[#111] font-display text-lg uppercase tracking-widest transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(233,195,73,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Confirm Payment
                  </>
                )}
              </button>

              <button
                onClick={() => onViewChange("hub")}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 font-mono text-xs uppercase tracking-widest transition-all rounded-xl"
              >
                Pay Later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
