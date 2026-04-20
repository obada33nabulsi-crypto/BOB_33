import { createContext, useContext, useState, type ReactNode } from "react";

type UICtx = {
  friendsOpen: boolean;
  setFriendsOpen: (b: boolean) => void;
  toggleFriends: () => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  toggleCart: () => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (b: boolean) => void;
  cartBounce: number; // increment to trigger animation
  bumpCart: () => void;
};

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(0);

  return (
    <Ctx.Provider
      value={{
        friendsOpen,
        setFriendsOpen,
        toggleFriends: () => setFriendsOpen(!friendsOpen),
        cartOpen,
        setCartOpen,
        toggleCart: () => setCartOpen(!cartOpen),
        checkoutOpen,
        setCheckoutOpen,
        cartBounce,
        bumpCart: () => setCartBounce((n) => n + 1),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be inside UIProvider");
  return c;
}
