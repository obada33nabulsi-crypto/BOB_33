import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, CreditCard, Wallet, Trash2 } from "lucide-react";
import { useUI } from "@/store/ui";
import { useShop } from "@/store/shop";
import { priceAfterDiscount, type Game } from "@/lib/games";

type Step = 1 | 2 | 3;
type PayMethod = "saved" | "new" | "wallet";

export default function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen } = useUI();
  const { cart, getGame, removeFromCart, clearCart, addToLibrary } = useShop();
  const [step, setStep] = useState<Step>(1);
  const [pay, setPay] = useState<PayMethod>("saved");
  const [orderId, setOrderId] = useState<string>("");

  const items = cart.map((id) => getGame(id)).filter(Boolean) as Game[];
  const total = useMemo(() => items.reduce((s, g) => s + priceAfterDiscount(g), 0), [items]);

  useEffect(() => {
    if (checkoutOpen) {
      setStep(1);
      setPay("saved");
    }
  }, [checkoutOpen]);

  const close = () => {
    setCheckoutOpen(false);
  };

  const goConfirm = () => {
    const newOrderId = "UMB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrderId(newOrderId);
    addToLibrary(cart, newOrderId);
    setStep(3);
    setTimeout(() => clearCart(), 300);
  };

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 bg-background/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card border-2 border-primary my-8"
            style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <h2 className="font-display text-base text-primary">CHECKOUT</h2>
              <button onClick={close} className="p-2 hover:bg-primary/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-2 p-4 border-b-2 border-border">
              {([
                [1, "Review"],
                [2, "Payment"],
                [3, "Confirm"],
              ] as [Step, string][]).map(([n, label], i) => (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 flex items-center justify-center font-display text-xs border-2 border-[#1a1a1a] transition ${
                      step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </div>
                  <span className={`font-display text-[10px] tracking-wider ${step >= n ? "text-foreground" : "text-muted-foreground"}`}>
                    {label.toUpperCase()}
                  </span>
                  {i < 2 && <div className={`w-8 h-0.5 ${step > n ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            <div className="p-6 min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && (
                    <div className="space-y-3">
                      <h3 className="font-display text-xs text-primary mb-2">REVIEW ORDER</h3>
                      {items.length === 0 && (
                        <p className="font-heading text-xl text-muted-foreground text-center py-8">No items to checkout.</p>
                      )}
                      {items.map((g) => (
                        <div key={g.id} className="flex items-center justify-between bg-background border-2 border-border p-3">
                          <div className="min-w-0">
                            <div className="font-heading text-xl truncate">{g.title}</div>
                            <div className="text-xs text-muted-foreground">{g.genres.join(" · ")} · 1 license</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display text-xs text-primary">${priceAfterDiscount(g)}</span>
                            <button
                              onClick={() => removeFromCart(g.id)}
                              className="p-1.5 hover:bg-destructive/20 transition"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <h3 className="font-display text-xs text-primary mb-2">PAYMENT METHOD</h3>
                      <PayOption
                        active={pay === "saved"}
                        onClick={() => setPay("saved")}
                        icon={<CreditCard className="h-5 w-5" />}
                        title="VISA •••• 4242"
                        subtitle="Expires 08/27"
                      />
                      <PayOption
                        active={pay === "wallet"}
                        onClick={() => setPay("wallet")}
                        icon={<Wallet className="h-5 w-5" />}
                        title="Umbrella Wallet"
                        subtitle="Balance: $128.50"
                      />
                      <PayOption
                        active={pay === "new"}
                        onClick={() => setPay("new")}
                        icon={<CreditCard className="h-5 w-5" />}
                        title="Use a new card"
                        subtitle="Add card details below"
                      />
                      {pay === "new" && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <Input label="Card Number" placeholder="1234 5678 9012 3456" full />
                          <Input label="Cardholder" />
                          <Input label="Expiry" placeholder="MM/YY" />
                          <Input label="CVV" placeholder="123" />
                        </div>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <ConfirmStep orderId={orderId} onClose={close} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {step !== 3 && (
              <div className="border-t-2 border-border p-4 flex items-center justify-between gap-3 bg-card">
                <div className="font-display text-sm">
                  TOTAL <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  {step === 2 && (
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 glass pixel-border font-display text-[10px] tracking-wider hover:border-primary"
                    >
                      ← BACK
                    </button>
                  )}
                  <button
                    disabled={items.length === 0}
                    onClick={() => (step === 1 ? setStep(2) : goConfirm())}
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                  >
                    {step === 1 ? "CONTINUE →" : "PLACE ORDER"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PayOption({
  active, onClick, icon, title, subtitle,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 border-2 transition text-left ${
        active ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"
      }`}
      style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
    >
      <div className={`p-2 ${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <div className="flex-1">
        <div className="font-display text-xs">{title}</div>
        <div className="font-heading text-lg text-muted-foreground">{subtitle}</div>
      </div>
      <div className={`h-5 w-5 border-2 border-[#1a1a1a] ${active ? "bg-primary" : "bg-muted"}`}>
        {active && <Check className="h-full w-full text-primary-foreground" />}
      </div>
    </button>
  );
}

function Input({ label, placeholder, full }: { label: string; placeholder?: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="font-display text-[10px] tracking-wider text-muted-foreground block mb-1">
        {label.toUpperCase()}
      </label>
      <input
        placeholder={placeholder}
        className="w-full bg-input border-2 border-border px-3 py-2 font-heading text-lg outline-none focus:border-primary"
      />
    </div>
  );
}

function ConfirmStep({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  // Generate confetti positions once
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400 - 50,
        rot: Math.random() * 360,
        color: ["#ea34a9", "#7e5ecc", "#64ff00", "#f453bb", "#d97ee0"][i % 5],
        delay: Math.random() * 0.3,
      })),
    [],
  );

  return (
    <div className="text-center py-6 relative overflow-hidden">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
            transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
            className="absolute h-2 w-2"
            style={{ background: p.color }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative h-20 w-20 mx-auto mb-4 flex items-center justify-center bg-[var(--brand-green-1)] border-2 border-[#1a1a1a]"
        style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
      >
        <Check className="h-10 w-10 text-[var(--gray-deep)]" strokeWidth={3} />
      </motion.div>

      <h3 className="font-display text-base text-gradient-pink mb-2">ORDER CONFIRMED</h3>
      <p className="font-heading text-xl text-muted-foreground mb-1">Thank you for your purchase!</p>
      <p className="font-heading text-lg text-foreground/70 mb-6">
        Order ID: <span className="text-primary">{orderId}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onClose}
          className="px-5 py-3 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
        >
          GO TO LIBRARY
        </button>
        <button
          onClick={onClose}
          className="px-5 py-3 glass pixel-border font-display text-[10px] tracking-wider hover:border-primary"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}
