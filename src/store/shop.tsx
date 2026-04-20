import { createContext, useContext, useState, type ReactNode } from "react";
import { GAMES, type Game } from "@/lib/games";

type ShopCtx = {
  cart: string[];
  wishlist: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  getGame: (id: string) => Game | undefined;
};

const Ctx = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const value: ShopCtx = {
    cart,
    wishlist,
    addToCart: (id) => setCart((c) => (c.includes(id) ? c : [...c, id])),
    removeFromCart: (id) => setCart((c) => c.filter((x) => x !== id)),
    toggleWishlist: (id) =>
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    getGame: (id) => GAMES.find((g) => g.id === id),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
