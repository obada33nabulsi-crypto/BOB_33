import { createContext, useContext, useState, type ReactNode } from "react";

type UICtx = {
  friendsOpen: boolean;
  setFriendsOpen: (b: boolean) => void;
  toggleFriends: () => void;
};

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [friendsOpen, setFriendsOpen] = useState(false);
  return (
    <Ctx.Provider
      value={{
        friendsOpen,
        setFriendsOpen,
        toggleFriends: () => setFriendsOpen(!friendsOpen),
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
