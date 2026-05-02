import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, CheckCircle2, Send } from "lucide-react";

export default function ForgotPasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sending, setSending] = useState(false);

  const reset = () => {
    setStep(1);
    setEmail("");
    setPwd("");
    setConfirm("");
    setSending(false);
  };
  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setStep(2);
  };

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8 || pwd !== confirm) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setStep(3);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md glass pixel-border p-6 relative"
            style={{ background: "rgba(20,20,28,0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="absolute top-3 right-3 p-1 hover:text-primary">
              <X className="h-5 w-5" />
            </button>

            {step === 1 && (
              <form onSubmit={sendLink}>
                <h3 className="font-display text-base text-gradient-pink mb-2">Forgot Password?</h3>
                <p className="font-heading text-lg text-muted-foreground mb-5">Enter your email and we'll send you a reset link.</p>
                <label className="relative block">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-3 py-2.5 font-heading text-lg outline-none transition"
                  />
                </label>
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-4 w-full py-2.5 font-display text-xs tracking-wider text-white border-2 border-[#1a1a1a] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
                >
                  {sending ? "SENDING..." : "SEND RESET LINK"}
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Send className="h-7 w-7 text-primary" />
                </motion.div>
                <h3 className="font-display text-base text-center text-gradient-pink mb-2">Check your email!</h3>
                <p className="font-heading text-lg text-muted-foreground text-center mb-5">
                  We sent a reset link to <span className="text-foreground">{email}</span>
                </p>
                <form onSubmit={submitNew} className="space-y-3">
                  <input
                    type="password"
                    placeholder="New password (min 8 chars)"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary px-3 py-2.5 font-heading text-lg outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary px-3 py-2.5 font-heading text-lg outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || pwd.length < 8 || pwd !== confirm}
                    className="w-full py-2.5 font-display text-xs text-white border-2 border-[#1a1a1a] disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
                  >
                    {sending ? "UPDATING..." : "UPDATE PASSWORD"}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-4 w-16 h-16 rounded-full bg-[var(--brand-green-1)]/20 flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9 text-[var(--brand-green-1)]" />
                </motion.div>
                <h3 className="font-display text-base text-gradient-pink mb-2">All set!</h3>
                <p className="font-heading text-lg text-muted-foreground mb-5">Your password has been updated.</p>
                <button
                  onClick={close}
                  className="w-full py-2.5 font-display text-xs text-white border-2 border-[#1a1a1a]"
                  style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
                >
                  BACK TO LOGIN
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
