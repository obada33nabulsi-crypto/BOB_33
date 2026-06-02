import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2, Check, X, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import SocialButtons from "@/components/SocialButtons";
import { useAuth } from "@/store/auth";
import logo from "@/assets/logo-umbrella.png"

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Create Account — UMBRELLA" }, { name: "description", content: "Create a UMBRELLA account." }] }),
  component: RegisterPage,
});

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
];

const TAKEN = new Set(["admin", "test", "player", "user", "nexus"]);

function strengthOf(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}
const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLORS = ["#4a4a4a", "#ff5757", "#ffb74d", "#64ff00", "#00e5ff"];

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "ok" | "bad">("idle");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("US");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [news, setNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);

  useEffect(() => {
    if (!username) return setUsernameStatus("idle");
    if (!usernameValid) return setUsernameStatus("bad");
    setUsernameStatus("checking");
    const t = setTimeout(() => {
      setUsernameStatus(TAKEN.has(username.toLowerCase()) ? "bad" : "ok");
    }, 500);
    return () => clearTimeout(t);
  }, [username, usernameValid]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const score = strengthOf(pwd);
  const reqs = useMemo(() => ([
    { ok: pwd.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(pwd), label: "One uppercase letter" },
    { ok: /[0-9]/.test(pwd), label: "One number" },
    { ok: /[^A-Za-z0-9]/.test(pwd), label: "One special character" },
  ]), [pwd]);
  const pwdValid = reqs.every((r) => r.ok);
  const confirmValid = confirm.length > 0 && confirm === pwd;

  const ageOk = useMemo(() => {
    if (!dob) return false;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return false;
    const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
    return age >= 13;
  }, [dob]);

  const formValid = usernameStatus === "ok" && emailValid && pwdValid && confirmValid && ageOk && agreeTos;

  const filteredCountries = COUNTRIES.filter((c) => c.name.toLowerCase().includes(countryQuery.toLowerCase()));
  const selected = COUNTRIES.find((c) => c.code === country);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formValid) return;
    setLoading(true);
    try {
      const u = await register({ username, email, password: pwd, country });
      setSuccess(true);
      setTimeout(() => navigate({ to: "/register" }), 700);
    } catch {
      setError("Could not create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-5">
        <div className="font-display text-sm text-gradient-pink"><img src={logo} alt="" /></div>
        <h2 className="mt-3 font-display text-lg">Create Account</h2>
        <p className="mt-2 font-heading text-lg text-muted-foreground">Start your gaming journey</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* Username */}
        <div>
          <label className="relative block">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              maxLength={20}
              className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-10 py-2.5 font-heading text-lg outline-none transition focus:shadow-[0_0_0_3px_rgba(234,52,169,0.25)]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              {usernameStatus === "ok" && <Check className="h-4 w-4 text-[var(--brand-green-1)]" />}
              {usernameStatus === "bad" && <X className="h-4 w-4 text-[#ff6b6b]" />}
            </span>
          </label>
          {username && !usernameValid && (
            <p className="mt-1 text-xs text-[#ff6b6b] font-heading">3-20 chars · letters, numbers, underscores</p>
          )}
          {usernameStatus === "bad" && usernameValid && (
            <p className="mt-1 text-xs text-[#ff6b6b] font-heading">That username is already taken.</p>
          )}
        </div>

        {/* Email */}
        <label className="relative block">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-3 py-2.5 font-heading text-lg outline-none transition focus:shadow-[0_0_0_3px_rgba(234,52,169,0.25)]"
          />
        </label>

        {/* Password */}
        <div>
          <label className="relative block">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-10 py-2.5 font-heading text-lg outline-none transition focus:shadow-[0_0_0_3px_rgba(234,52,169,0.25)]"
            />
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>
          {pwd && (
            <div className="mt-2 space-y-2">
              <div className="h-1.5 w-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 4) * 100}%`, backgroundColor: STRENGTH_COLORS[score] }}
                  className="h-full"
                />
              </div>
              <p className="text-xs font-heading" style={{ color: STRENGTH_COLORS[score] }}>
                {STRENGTH_LABELS[score]}
              </p>
              <ul className="grid grid-cols-2 gap-1 text-xs font-heading">
                {reqs.map((r) => (
                  <li key={r.label} className={`flex items-center gap-1 ${r.ok ? "text-[var(--brand-green-1)]" : "text-muted-foreground"}`}>
                    {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm */}
        <label className="relative block">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type={showPwd ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary pl-10 pr-10 py-2.5 font-heading text-lg outline-none transition"
          />
          {confirm && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {confirmValid ? <Check className="h-4 w-4 text-[var(--brand-green-1)]" /> : <X className="h-4 w-4 text-[#ff6b6b]" />}
            </span>
          )}
        </label>

        {/* DOB + Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary px-3 py-2.5 font-heading text-base outline-none transition"
            />
            {dob && !ageOk && <p className="mt-1 text-xs text-[#ff6b6b] font-heading">You must be 13+.</p>}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCountryOpen((o) => !o)}
              className="w-full bg-[#1a1a22] border-2 border-border focus:border-primary px-3 py-2.5 font-heading text-base outline-none transition flex items-center gap-2 text-left"
            >
              <span className="text-lg">{selected?.flag}</span>
              <span className="flex-1 truncate">{selected?.name}</span>
            </button>
            <AnimatePresence>
              {countryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 mt-1 w-full max-h-56 overflow-auto bg-[#1a1a22] border-2 border-primary"
                >
                  <input
                    autoFocus
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent border-b-2 border-border px-3 py-2 font-heading text-base outline-none"
                  />
                  {filteredCountries.map((c) => (
                    <button
                      type="button"
                      key={c.code}
                      onClick={() => { setCountry(c.code); setCountryOpen(false); setCountryQuery(""); }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/20 text-left font-heading text-base"
                    >
                      <span className="text-lg">{c.flag}</span> {c.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Checkboxes */}
        <label className="flex items-start gap-2 font-heading text-base cursor-pointer">
          <input type="checkbox" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} className="mt-1 h-4 w-4 accent-[#ea34a9]" />
          <span>I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span></span>
        </label>
        <label className="flex items-start gap-2 font-heading text-base cursor-pointer">
          <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} className="mt-1 h-4 w-4 accent-[#ea34a9]" />
          <span>I want to receive news and special offers</span>
        </label>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#ff6b6b] font-heading"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!formValid || loading || success}
          className="w-full py-3 font-display text-xs tracking-wider text-white border-2 border-[#1a1a1a] transition hover:shadow-[0_0_20px_rgba(234,52,169,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
        >
          {success ? (
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> ACCOUNT CREATED</span>
          ) : loading ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> CREATING...</span>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-border" />
          <span className="font-heading text-sm text-muted-foreground">or sign up with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <SocialButtons />

        <div>
          <a href="/register"
            style={{  background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
            className="w-full py-3 px-22 font-display text-xs tracking-wider text-white border-2 border-[#1a1a1a] transition hover:shadow-[0_0_20px_rgba(234,52,169,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
          > sign in as guest </a>
        </div>
      </form>
    </AuthLayout>
  );
}


export default RegisterPage;