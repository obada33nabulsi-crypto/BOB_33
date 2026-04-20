import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/store/shop";
import { useUI } from "@/store/ui";
import { GAMES, priceAfterDiscount, type Game } from "@/lib/games";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Umbrella" },
      { name: "description", content: "Your saved games wishlist." },
    ],
  }),
  component: FavoritesPage,
});

type SortKey = "date" | "price-asc" | "price-desc" | "rating";
type Filter = "all" | "sale" | "recent";

function FavoritesPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const { bumpCart } = useUI();
  const [sort, setSort] = useState<SortKey>("date");
  const [filter, setFilter] = useState<Filter>("all");
  const [notifications, setNotifications] = useState<Set<string>>(new Set());

  const games = useMemo(() => {
    let list = wishlist.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean) as Game[];

    if (filter === "sale") list = list.filter((g) => g.discount);
    if (filter === "recent") list = list.filter((g) => g.isNew);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => priceAfterDiscount(a) - priceAfterDiscount(b));
        break;
      case "price-desc":
        list.sort((a, b) => priceAfterDiscount(b) - priceAfterDiscount(a));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [wishlist, sort, filter]);

  function toggleNotify(id: string) {
    setNotifications((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Sale notification off");
      } else {
        next.add(id);
        toast.success("You'll be notified on sale! 🔔");
      }
      return next;
    });
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-8xl">💔</div>
          <h1 className="font-display text-base text-primary">NO GAMES IN WISHLIST YET</h1>
          <p className="font-heading text-xl text-muted-foreground">
            Browse the store and tap the heart to save games you love!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
          >
            BROWSE STORE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-base text-primary">MY WISHLIST</h1>
          <p className="font-heading text-xl text-muted-foreground mt-1">
            {wishlist.length} game{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "sale", "recent"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 font-display text-[9px] tracking-wider border-2 transition ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "ALL" : f === "sale" ? "ON SALE" : "RECENTLY ADDED"}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-input border-2 border-border px-3 py-1.5 font-display text-[9px] tracking-wider text-foreground outline-none"
          >
            <option value="date">DATE ADDED</option>
            <option value="price-asc">PRICE: LOW→HIGH</option>
            <option value="price-desc">PRICE: HIGH→LOW</option>
            <option value="rating">RATING</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {games.map((game) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card border-2 border-border overflow-hidden group"
              style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
            >
              <Link to="/game/$id" params={{ id: game.id }} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  {game.discount && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px]">
                      -{game.discount}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4 space-y-3">
                <h3 className="font-heading font-bold text-2xl leading-none">{game.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {game.genres.map((g) => (
                    <span
                      key={g}
                      className="text-[10px] uppercase px-1.5 py-0.5 bg-secondary text-secondary-foreground font-display"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  {game.discount ? (
                    <>
                      <span className="font-heading text-lg text-muted-foreground line-through">
                        ${game.price}
                      </span>
                      <span className="font-display text-lg text-primary">
                        ${priceAfterDiscount(game)}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-lg">${game.price}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const added = addToCart(game.id);
                      if (added) {
                        bumpCart();
                        toast.success(`${game.title} added to cart!`);
                      } else {
                        toast("Already in your cart!");
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white font-display text-[9px] tracking-wider hover:brightness-110 transition"
                    style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> ADD TO CART
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      toggleWishlist(game.id);
                      toast("Removed from Wishlist");
                    }}
                    className="p-2 bg-destructive text-white"
                    style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </motion.button>
                  <button
                    onClick={() => toggleNotify(game.id)}
                    className={`p-2 border-2 transition ${
                      notifications.has(game.id)
                        ? "border-[var(--brand-green-1)] text-[var(--brand-green-1)]"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    aria-label="Notify on sale"
                    title={notifications.has(game.id) ? "Sale notification on" : "Notify me on sale"}
                  >
                    {notifications.has(game.id) ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
