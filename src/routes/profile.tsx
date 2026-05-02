import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, Plus, X, CreditCard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Settings — Umbrella" },
      { name: "description", content: "Manage your Umbrella account, security, and payment methods." },
    ],
  }),
  component: ProfilePage,
});

type Tab = "account" | "security" | "privacy" | "notifications" | "payment";

function ProfilePage() {
  useRequireAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("account");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [cards, setCards] = useState([
    { id: "c1", brand: "VISA", last4: "4242", exp: "08/27" },
    { id: "c2", brand: "MASTERCARD", last4: "8821", exp: "11/26" },
  ]);
  const [account, setAccount] = useState({
    display: "PixelSamurai",
    username: "pixel_samurai",
    email: "samurai@umbrella.gg",
    bio: "Indie game enthusiast. Speedrunner. Synthwave addict.",
    country: "Japan",
  });

  const tabs: [Tab, string][] = [
    ["account", "Account"],
    ["security", "Security"],
    ["privacy", "Privacy"],
    ["notifications", "Notifications"],
    ["payment", "Payment Methods"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-heading text-lg text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition">HOME</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">PROFILE SETTINGS</span>
      </nav>

      {/* Header */}
      <div className="bg-card border-2 border-border p-6 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6"
           style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}>
        <div className="relative">
          <div
            className="h-28 w-28 flex items-center justify-center font-display text-2xl text-white border-2 border-[#1a1a1a]"
            style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
          >
            PS
          </div>
          <button
            onClick={() => toast.success("Avatar uploader opened")}
            className="absolute -bottom-2 -right-2 h-9 w-9 bg-primary text-primary-foreground flex items-center justify-center border-2 border-[#1a1a1a]"
            aria-label="Upload avatar"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display text-2xl md:text-3xl text-gradient-pink">{account.display.toUpperCase()}</h1>
          <p className="font-heading text-xl text-muted-foreground mt-1">{account.email}</p>
          <p className="font-heading text-lg text-muted-foreground">Member since JAN 2023</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-card border-2 border-border p-2 h-fit"
               style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}>
          {tabs.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`w-full text-left px-4 py-3 font-display text-[11px] tracking-wider transition ${
                tab === k
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <div className="border-t-2 border-border my-2" />
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full text-left px-4 py-3 font-display text-[11px] tracking-wider transition text-[#ff6b6b] hover:bg-[#ff6b6b]/10 inline-flex items-center gap-2"
          >
            <LogOut className="h-3.5 w-3.5" /> SIGN OUT
          </button>
        </aside>

        <AnimatePresence>
          {confirmLogout && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
              onClick={() => setConfirmLogout(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="glass pixel-border max-w-sm w-full p-6 text-center"
                style={{ background: "rgba(20,20,28,0.95)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display text-base text-gradient-pink mb-3">Sign out?</h3>
                <p className="font-heading text-lg text-muted-foreground mb-5">Are you sure you want to sign out?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmLogout(false)}
                    className="flex-1 py-2.5 font-display text-xs border-2 border-border hover:border-primary transition"
                  >CANCEL</button>
                  <button
                    onClick={() => { logout(); setConfirmLogout(false); toast("Signed out"); navigate({ to: "/" }); }}
                    className="flex-1 py-2.5 font-display text-xs text-white border-2 border-[#1a1a1a]"
                    style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}
                  >SIGN OUT</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Content */}
        <div className="bg-card border-2 border-border p-6"
             style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "account" && (
                <form
                  onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-base mb-2 text-primary">ACCOUNT INFO</h2>
                  {[
                    ["Display Name", "display"],
                    ["Username", "username"],
                    ["Email", "email"],
                  ].map(([label, key]) => (
                    <Field
                      key={key}
                      label={label}
                      value={account[key as keyof typeof account]}
                      onChange={(v) => setAccount({ ...account, [key]: v })}
                    />
                  ))}
                  <div>
                    <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-2">
                      BIO
                    </label>
                    <textarea
                      value={account.bio}
                      onChange={(e) => setAccount({ ...account, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-input border-2 border-border px-3 py-2 font-heading text-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-2">
                      COUNTRY
                    </label>
                    <select
                      value={account.country}
                      onChange={(e) => setAccount({ ...account, country: e.target.value })}
                      className="w-full bg-input border-2 border-border px-3 py-2 font-heading text-lg outline-none focus:border-primary"
                    >
                      {["Japan", "United States", "Brazil", "Germany", "France", "South Korea", "Canada", "United Kingdom"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                  >
                    SAVE CHANGES
                  </button>
                </form>
              )}

              {tab === "security" && (
                <div className="space-y-6">
                  <h2 className="font-display text-base mb-2 text-primary">SECURITY</h2>
                  <form
                    onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}
                    className="space-y-4"
                  >
                    <Field label="Current Password" type="password" />
                    <Field label="New Password" type="password" />
                    <Field label="Confirm New Password" type="password" />
                    <button className="px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink">
                      UPDATE PASSWORD
                    </button>
                  </form>

                  <div className="border-t-2 border-border pt-6 flex items-center justify-between">
                    <div>
                      <div className="font-display text-xs mb-1">TWO-FACTOR AUTH</div>
                      <div className="font-heading text-lg text-muted-foreground">Add an extra layer of security</div>
                    </div>
                    <button
                      onClick={() => { setTwoFA(!twoFA); toast(twoFA ? "2FA disabled" : "2FA enabled"); }}
                      className={`w-14 h-7 border-2 border-[#1a1a1a] relative transition ${twoFA ? "bg-[var(--brand-green-1)]" : "bg-muted"}`}
                      aria-label="Toggle 2FA"
                    >
                      <span className={`absolute top-0.5 h-5 w-5 bg-card border-2 border-[#1a1a1a] transition-transform ${twoFA ? "translate-x-7" : "translate-x-0.5"}`} />
                    </button>
                  </div>

                  <div className="border-t-2 border-border pt-6">
                    <div className="font-display text-xs mb-3">ACTIVE SESSIONS</div>
                    <div className="space-y-2">
                      {[
                        { device: "Chrome · Windows", loc: "Tokyo, JP", current: true },
                        { device: "Safari · iPhone 15", loc: "Tokyo, JP", current: false },
                        { device: "Firefox · MacOS", loc: "Osaka, JP", current: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-background border-2 border-border p-3">
                          <div>
                            <div className="font-heading text-xl">{s.device}</div>
                            <div className="text-xs text-muted-foreground">
                              {s.loc} {s.current && <span className="text-[var(--brand-green-1)] ml-2">● ACTIVE NOW</span>}
                            </div>
                          </div>
                          {!s.current && (
                            <button
                              onClick={() => toast(`Session revoked`)}
                              className="px-3 py-1.5 bg-destructive text-destructive-foreground font-display text-[10px] tracking-wider"
                              style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                            >
                              REVOKE
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "privacy" && (
                <div className="space-y-4">
                  <h2 className="font-display text-base mb-2 text-primary">PRIVACY</h2>
                  {[
                    "Show my profile to everyone",
                    "Share my game library",
                    "Show online status to friends",
                    "Allow friend requests",
                  ].map((label, i) => (
                    <PrivacyToggle key={label} label={label} defaultOn={i !== 1} />
                  ))}
                </div>
              )}

              {tab === "notifications" && (
                <div className="space-y-4">
                  <h2 className="font-display text-base mb-2 text-primary">NOTIFICATIONS</h2>
                  {[
                    "Email me about new releases",
                    "Friend invites and messages",
                    "Wishlist deals and discounts",
                    "Newsletter and promos",
                  ].map((label, i) => (
                    <PrivacyToggle key={label} label={label} defaultOn={i < 3} />
                  ))}
                </div>
              )}

              {tab === "payment" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base text-primary">PAYMENT METHODS</h2>
                    <button
                      onClick={() => setAddCard(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
                    >
                      <Plus className="h-3 w-3" /> ADD CARD
                    </button>
                  </div>
                  <div className="space-y-3">
                    {cards.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 bg-background border-2 border-border p-4"
                           style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}>
                        <CreditCard className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <div className="font-display text-xs">{c.brand} •••• {c.last4}</div>
                          <div className="font-heading text-lg text-muted-foreground">Expires {c.exp}</div>
                        </div>
                        <button
                          onClick={() => { setCards(cards.filter((x) => x.id !== c.id)); toast("Card removed"); }}
                          className="p-2 hover:bg-destructive/10 transition"
                          aria-label="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add card modal */}
      <AnimatePresence>
        {addCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddCard(false)}
            className="fixed inset-0 bg-background/85 z-[100] flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                setCards([...cards, { id: `c${Date.now()}`, brand: "VISA", last4: "0000", exp: "01/30" }]);
                setAddCard(false);
                toast.success("Card added");
              }}
              className="w-full max-w-md bg-card border-2 border-primary p-6 space-y-4"
              style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-base text-primary">ADD NEW CARD</h3>
                <button type="button" onClick={() => setAddCard(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Field label="Cardholder Name" />
              <Field label="Card Number" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry" placeholder="MM/YY" />
                <Field label="CVV" placeholder="123" />
              </div>
              <button type="submit" className="w-full px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink">
                SAVE CARD
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-2">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-input border-2 border-border px-3 py-2 font-heading text-lg outline-none focus:border-primary"
      />
    </div>
  );
}

function PrivacyToggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between bg-background border-2 border-border p-4">
      <div className="font-heading text-xl">{label}</div>
      <button
        onClick={() => { setOn(!on); toast(on ? "Disabled" : "Enabled"); }}
        className={`w-14 h-7 border-2 border-[#1a1a1a] relative transition ${on ? "bg-[var(--brand-green-1)]" : "bg-muted"}`}
        aria-label="Toggle"
      >
        <span className={`absolute top-0.5 h-5 w-5 bg-card border-2 border-[#1a1a1a] transition-transform ${on ? "translate-x-7" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
