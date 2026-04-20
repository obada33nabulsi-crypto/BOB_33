import { createContext, useContext, useState, type ReactNode } from "react";
import { GAMES, type Game } from "@/lib/games";

type ShopCtx = {
  cart: string[];
  wishlist: string[];
  /** Returns true if added, false if already in cart. */
  addToCart: (id: string) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  moveToWishlist: (id: string) => void;
  getGame: (id: string) => Game | undefined;
};

const Ctx = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const value: ShopCtx = {
    cart,
    wishlist,
    addToCart: (id) => {
      if (cart.includes(id)) return false;
      setCart([...cart, id]);
      return true;
    },
    removeFromCart: (id) => setCart((c) => c.filter((x) => x !== id)),
    clearCart: () => setCart([]),
    toggleWishlist: (id) =>
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    moveToWishlist: (id) => {
      setCart((c) => c.filter((x) => x !== id));
      setWishlist((w) => (w.includes(id) ? w : [...w, id]));
    },
    getGame: (id) => GAMES.find((g) => g.id === id),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
