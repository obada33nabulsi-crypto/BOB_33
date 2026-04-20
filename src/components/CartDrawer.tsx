import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Heart, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { useUI } from "@/store/ui";
import { useShop } from "@/store/shop";
import { priceAfterDiscount, type Game } from "@/lib/games";

const GRADIENTS = [
  "linear-gradient(135deg, #ea34a9, #7e5ecc)",
  "linear-gradient(135deg, #df158c, #f453bb)",
  "linear-gradient(135deg, #7e5ecc, #d97ee0)",
  "linear-gradient(135deg, #64ff00, #98ff55)",
  "linear-gradient(135deg, #aa4faf, #ea34a9)",
  "linear-gradient(135deg, #d97ee0, #a88fe5)",
];

function gradientFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, setCheckoutOpen } = useUI();
  const { cart, getGame, removeFromCart, moveToWishlist } = useShop();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);
  const [shake, setShake] = useState(false);

  const items = cart.map((id) => getGame(id)).filter(Boolean) as Game[];
  const subtotal = items.reduce((s, g) => s + priceAfterDiscount(g), 0);
  const discount = applied ? +(subtotal * (applied.pct / 100)).toFixed(2) : 0;
  const total = +(subtotal - discount).toFixed(2);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "NEXUS20") {
      setApplied({ code: "NEXUS20", pct: 20 });
      toast.success("Promo code applied — 20% off!");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  const handleBrowse = () => {
    setCartOpen(false);
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-card border-l-2 border-primary z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <h2 className="font-display text-base text-primary">
                YOUR CART {items.length > 0 && <span className="text-foreground/70">({items.length})</span>}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-primary/10 transition"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <EmptyState onBrowse={handleBrowse} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((g) => (
                      <motion.div
                        key={g.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="bg-background border-2 border-border p-3 flex gap-3"
                        style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                      >
                        <div
                          className="h-20 w-20 shrink-0 flex items-center justify-center font-display text-2xl text-white border-2 border-[#1a1a1a] relative overflow-hidden"
                          style={{ background: gradientFor(g.id) }}
                        >
                          <div className="absolute inset-0 scanlines opacity-30" />
                          <span className="relative">{g.title.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-heading text-xl leading-none truncate">{g.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-secondary text-secondary-foreground font-display">
                              {g.genres[0]}
                            </span>
                            <span className="text-xs text-muted-foreground" title="Windows">⊞</span>
                            <span className="text-xs text-muted-foreground" title="Mac"></span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            {g.discount ? (
                              <>
                                <span className="font-heading text-base text-muted-foreground line-through">${g.price}</span>
                                <span className="font-display text-xs text-primary">${priceAfterDiscount(g)}</span>
                              </>
                            ) : (
                              <span className="font-display text-xs">${g.price}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border-2 border-border bg-card">
                              <button
                                disabled
                                className="w-6 h-6 flex items-center justify-center text-muted-foreground/50 cursor-not-allowed"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-display text-[10px] px-1">1 LICENSE</span>
                              <button
                                disabled
                                className="w-6 h-6 flex items-center justify-center text-muted-foreground/50 cursor-not-allowed"
                                aria-label="Increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { moveToWishlist(g.id); toast("Saved for later"); }}
                                className="p-1.5 hover:bg-primary/10 transition group"
                                aria-label="Save for later"
                                title="Save for later"
                              >
                                <Heart className="h-4 w-4 group-hover:text-primary transition" />
                              </button>
                              <motion.button
                                whileTap={{ scale: 0.85, rotate: -10 }}
                                onClick={() => { removeFromCart(g.id); toast("Item removed"); }}
                                className="p-1.5 hover:bg-destructive/20 transition group"
                                aria-label="Remove"
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4 group-hover:text-destructive transition" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="border-t-2 border-border p-4 bg-card space-y-3">
                  <motion.div
                    animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex gap-2"
                  >
                    <div className="flex items-center gap-2 flex-1 bg-input border-2 border-border px-3 py-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="PROMO CODE"
                        className="w-full bg-transparent font-heading text-lg outline-none placeholder:text-muted-foreground uppercase"
                      />
                    </div>
                    <button
                      onClick={applyPromo}
                      className="px-4 bg-secondary text-secondary-foreground font-display text-[10px] tracking-wider"
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    >
                      APPLY
                    </button>
                  </motion.div>

                  <div className="space-y-1 font-heading text-lg">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {applied && (
                      <div className="flex justify-between text-[var(--brand-green-1)]">
                        <span>{applied.code} (-{applied.pct}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-2 border-t-2 border-border">
                      <span className="font-display text-xs">TOTAL</span>
                      <span className="font-display text-base text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform animate-pulse-neon"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full font-heading text-lg text-muted-foreground hover:text-primary transition"
                  >
                    Continue Shopping →
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <div
          className="h-28 w-28 mx-auto bg-background border-2 border-border flex items-center justify-center"
          style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
        >
          <ShoppingBag className="h-12 w-12 text-primary" strokeWidth={1.5} />
        </div>
      </motion.div>
      <h3 className="font-display text-base text-foreground mb-2">YOUR CART IS EMPTY</h3>
      <p className="font-heading text-xl text-muted-foreground mb-6 max-w-xs">
        Explore our store and find your next adventure.
      </p>
      <button
        onClick={onBrowse}
        className="px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
      >
        BROWSE GAMES
      </button>
    </div>
  );
}
