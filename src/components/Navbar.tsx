import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ShoppingCart, ChevronDown, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GAMES } from "@/lib/games";
import { useShop } from "@/store/shop";

const CATEGORIES = ["Action", "RPG", "Strategy", "Indie", "Free to Play"];

export default function Navbar() {
  const { cart } = useShop();
  const [query, setQuery] = useState("");
  const [showCats, setShowCats] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return GAMES.filter((g) => g.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCats(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="glass-strong sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="h-8 w-8 rounded-md bg-[var(--gradient-neon)] glow-cyan" />
            <div className="absolute inset-0 h-8 w-8 rounded-md border border-primary/50 animate-pulse-neon" />
          </div>
          <span className="font-display text-2xl tracking-widest text-gradient-neon">UMBRELLA</span>
        </a>

        {/* Categories */}
        <div className="relative hidden lg:block" ref={catRef}>
          <button
            onClick={() => setShowCats((s) => !s)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-heading font-semibold uppercase tracking-wider text-foreground/80 hover:text-primary transition"
          >
            Categories <ChevronDown className={`h-4 w-4 transition ${showCats ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showCats && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 mt-2 w-56 rounded-lg glass overflow-hidden"
              >
                {CATEGORIES.map((c) => (
                  <a
                    key={c}
                    href="#catalog"
                    onClick={() => setShowCats(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition"
                  >
                    {c}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <div className={`flex items-center gap-2 rounded-md bg-input/60 px-3 py-2 transition ${searchFocused ? "ring-2 ring-primary glow-cyan" : "ring-1 ring-border"}`}>
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search games, genres, studios..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <AnimatePresence>
            {searchFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 mt-2 rounded-lg glass overflow-hidden z-50"
              >
                {suggestions.map((g) => (
                  <a
                    key={g.id}
                    href="#catalog"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-primary/10 transition"
                  >
                    <img src={g.cover} alt={g.title} className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.genres.join(" · ")}</div>
                    </div>
                    <div className="text-xs text-primary font-semibold">${g.price}</div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <button className="relative p-2 rounded-md hover:bg-primary/10 transition group">
            <ShoppingCart className="h-5 w-5 text-foreground/80 group-hover:text-primary transition" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-[var(--gradient-neon)] text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1 glow-cyan"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {/* Avatar */}
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-primary-foreground glow-purple">
            <User className="h-4 w-4" />
          </button>
          <button onClick={() => setShowMobile((s) => !s)} className="lg:hidden p-2">
            {showMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {CATEGORIES.map((c) => (
                <a key={c} href="#catalog" onClick={() => setShowMobile(false)} className="block py-2 text-sm font-heading uppercase tracking-wider hover:text-primary">
                  {c}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
