import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import SocialButtons from "@/components/SocialButtons";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { useAuth } from "@/store/auth";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign In — NexusStore" }, { name: "description", content: "Sign in to your NexusStore account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (pwd.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, pwd);
      setSuccess(true);
      toast.success(`Welcome back, ${u.username}! 🎮`);
      setTimeout(() => navigate({ to: search.redirect || "/" }), 700);
    } catch {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="font-display text-sm text-gradient-pink">NEXUSSTORE</div>
        <h2 className="mt-4 font-display text-lg">Welcome Back</h2>
        <p className="mt-2 font-heading text-lg text-muted-foreground">Sign in to your account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="relative block">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-3 py-2.5 font-heading text-lg outline-none transition focus:shadow-[0_0_0_3px_rgba(234,52,169,0.25)]"
          />
        </label>

        <label className="relative block">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-10 py-2.5 font-heading text-lg outline-none transition focus:shadow-[0_0_0_3px_rgba(234,52,169,0.25)]"
          />
          <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-heading text-base cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#ea34a9]" />
            Remember me
          </label>
          <button type="button" onClick={() => setForgot(true)} className="font-heading text-base text-primary hover:underline">
            Forgot Password?
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-[#ff6b6b] font-heading"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 font-display text-xs tracking-wider text-white border-2 border-[#1a1a1a] transition hover:shadow-[0_0_20px_rgba(234,52,169,0.7)] disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
        >
          {success ? (
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> SUCCESS</span>
          ) : loading ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> SIGNING IN...</span>
          ) : (
            "SIGN IN"
          )}
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="font-heading text-sm text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <SocialButtons />

        <p className="text-center font-heading text-base text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </form>

      <ForgotPasswordModal open={forgot} onClose={() => setForgot(false)} />
    </AuthLayout>
  );
}
