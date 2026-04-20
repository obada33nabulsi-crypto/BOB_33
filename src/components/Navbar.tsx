import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GAMES } from "@/lib/games";
import { useShop } from "@/store/shop";
import logoUrl from "@/assets/logo-umbrella.png";
import cartIcon from "@/assets/icon-cart.png";
import homeIcon from "@/assets/icon-home.png";
import heartIcon from "@/assets/icon-heart.png";
import libraryIcon from "@/assets/icon-library.png";
import settingsIcon from "@/assets/icon-settings.png";

const CATEGORIES = ["Action", "RPG", "Strategy", "Indie", "Free to Play"];

export default function Navbar() {
  const { cart, wishlist } = useShop();
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
      <div className="container mx-auto flex h-20 items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 shrink-0">
          <img src={homeIcon} alt="" className="pixel-img h-9 w-9" />
          <img src={logoUrl} alt="Umbrella" className="pixel-img h-8 md:h-10 w-auto" />
        </a>

        {/* Categories */}
        <div className="relative hidden lg:block ml-4" ref={catRef}>
          <button
            onClick={() => setShowCats((s) => !s)}
            className="flex items-center gap-1 px-3 py-2 font-heading text-xl uppercase text-foreground/90 hover:text-primary transition"
          >
            Categories <ChevronDown className={`h-4 w-4 transition ${showCats ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showCats && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 mt-2 w-56 glass pixel-border overflow-hidden"
              >
                {CATEGORIES.map((c) => (
                  <a
                    key={c}
                    href="#catalog"
                    onClick={() => setShowCats(false)}
                    className="block px-4 py-2.5 font-heading text-lg hover:bg-primary hover:text-primary-foreground transition"
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
          <div className={`flex items-center gap-2 bg-input px-3 py-2 transition border-2 ${searchFocused ? "border-primary" : "border-border"}`}
               style={searchFocused ? { boxShadow: "4px 4px 0 0 #df158c" } : undefined}>
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="SEARCH GAMES..."
              className="w-full bg-transparent font-heading text-lg outline-none placeholder:text-muted-foreground"
            />
          </div>
          <AnimatePresence>
            {searchFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 mt-2 glass pixel-border overflow-hidden z-50"
              >
                {suggestions.map((g) => (
                  <a
                    key={g.id}
                    href="#catalog"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-primary/20 transition"
                  >
                    <img src={g.cover} alt={g.title} className="h-10 w-10 object-cover border-2 border-border" />
                    <div className="flex-1">
                      <div className="font-heading text-lg leading-none">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.genres.join(" · ")}</div>
                    </div>
                    <div className="font-heading text-lg text-primary">${g.price}</div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Wishlist */}
          <button className="relative p-2 hover:bg-primary/10 transition group" aria-label="Wishlist">
            <img src={heartIcon} alt="" className="pixel-img h-7 w-7" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 bg-[var(--brand-pink-1)] text-[10px] font-display text-white flex items-center justify-center px-1">
                {wishlist.length}
              </span>
            )}
          </button>
          {/* Library */}
          <button className="relative p-2 hover:bg-primary/10 transition hidden sm:block" aria-label="Library">
            <img src={libraryIcon} alt="" className="pixel-img h-7 w-7" />
          </button>
          {/* Cart */}
          <button className="relative p-2 hover:bg-primary/10 transition group" aria-label="Cart">
            <img src={cartIcon} alt="" className="pixel-img h-8 w-8" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 min-w-5 bg-[var(--brand-green-1)] text-[10px] font-display text-[var(--gray-deep)] flex items-center justify-center px-1"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {/* Settings */}
          <button className="hidden sm:flex p-2 hover:bg-primary/10 transition" aria-label="Settings">
            <img src={settingsIcon} alt="" className="pixel-img h-7 w-7" />
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
            className="lg:hidden overflow-hidden border-t-2 border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {CATEGORIES.map((c) => (
                <a key={c} href="#catalog" onClick={() => setShowMobile(false)} className="block py-2 font-heading text-xl uppercase hover:text-primary">
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
