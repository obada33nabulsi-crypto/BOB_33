import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { GAMES, priceAfterDiscount, type Game } from "@/lib/games";
import { SAMPLE_REVIEWS } from "@/lib/friends";
import { useShop } from "@/store/shop";
import GameCard from "@/components/GameCard";
import cartIcon from "@/assets/icon-cart.png";
import heartIcon from "@/assets/icon-heart.png";

export const Route = createFileRoute("/game/$id")({
  loader: ({ params }) => {
    const game = GAMES.find((g) => g.id === params.id);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.game.title} — Umbrella` },
          { name: "description", content: loaderData.game.description },
          { property: "og:title", content: `${loaderData.game.title} — Umbrella` },
          { property: "og:description", content: loaderData.game.description },
          { property: "og:image", content: loaderData.game.cover },
        ]
      : [],
  }),
  component: GamePage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="font-display text-2xl mb-4">GAME NOT FOUND</h1>
      <Link to="/" className="text-primary font-heading text-xl hover:underline">
        ← Back to store
      </Link>
    </div>
  ),
});

type Tab = "overview" | "screenshots" | "specs" | "reviews";

const SCREEN_GRADIENTS = [
  "linear-gradient(135deg, #ea34a9, #7e5ecc)",
  "linear-gradient(135deg, #7e5ecc, #d97ee0)",
  "linear-gradient(135deg, #df158c, #f453bb)",
  "linear-gradient(135deg, #64ff00, #98ff55)",
  "linear-gradient(135deg, #aa4faf, #ea34a9)",
  "linear-gradient(135deg, #353535, #7e5ecc)",
];

function GamePage() {
  const { game } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [tab, setTab] = useState<Tab>("overview");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [trailer, setTrailer] = useState(false);

  const isWished = wishlist.includes(game.id);
  const finalPrice = priceAfterDiscount(game);
  const similar = GAMES.filter((g: Game) => g.id !== game.id).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden border-b-2 border-border">
        <div className="absolute inset-0">
          <img src={game.cover} alt={game.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 scanlines opacity-20" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 pt-8 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-heading text-lg text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition">HOME</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition cursor-pointer">{game.genres[0]?.toUpperCase()}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{game.title.toUpperCase()}</span>
          </nav>

          <div className="max-w-2xl pt-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {game.genres.map((g) => (
                <span key={g} className="px-2 py-1 bg-secondary text-secondary-foreground font-display text-[10px] tracking-wider">
                  {g.toUpperCase()}
                </span>
              ))}
              {game.discount && (
                <span className="px-2 py-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider">
                  -{game.discount}%
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-gradient-pink leading-tight mb-4">
              {game.title.toUpperCase()}
            </h1>
            <div className="font-heading text-lg text-muted-foreground mb-6">
              By NEON STUDIOS · Released MAR 14, 2025
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[var(--brand-green-1)] text-[var(--brand-green-1)]" />
                <span className="font-heading text-lg">{game.rating}</span>
              </div>
              <span className="font-heading text-lg text-muted-foreground">12.4K REVIEWS</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTrailer(true)}
                className="inline-flex items-center gap-2 px-5 py-3 glass pixel-border text-foreground font-display text-xs tracking-wider hover:border-primary transition"
              >
                <Play className="h-4 w-4 fill-current" /> WATCH TRAILER
              </button>
              <button
                onClick={() => { addToCart(game.id); toast.success(`${game.title} added to cart`); }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <img src={cartIcon} alt="" className="pixel-img h-5 w-5" />
                ADD TO CART · ${finalPrice}
                {game.discount && <span className="text-[10px] line-through opacity-60 ml-1">${game.price}</span>}
              </button>
              <button
                onClick={() => { toggleWishlist(game.id); toast(isWished ? "Removed from wishlist" : "Added to wishlist"); }}
                className="h-12 w-12 bg-card border-2 border-border flex items-center justify-center hover:border-primary transition"
                aria-label="Wishlist"
              >
                <img src={heartIcon} alt="" className={`pixel-img h-5 w-5 ${isWished ? "opacity-100" : "opacity-40 grayscale"}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-4 lg:px-8 py-12 grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* Tabs */}
          <div className="flex flex-wrap border-b-2 border-border mb-6">
            {([
              ["overview", "Overview"],
              ["screenshots", "Screenshots"],
              ["specs", "System Reqs"],
              ["reviews", "Reviews"],
            ] as [Tab, string][]).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-3 font-display text-[11px] tracking-wider transition border-b-2 -mb-0.5 ${
                  tab === k
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "overview" && (
                <div className="space-y-4 font-heading text-xl text-foreground/80 leading-relaxed">
                  <p>{game.description}</p>
                  <p>
                    Forge your destiny across a sprawling open world packed with handcrafted side stories, dynamic faction battles, and choices that ripple through every chapter. The signature combat system blends fluid melee with explosive ranged abilities, letting you build a playstyle as bold as you are.
                  </p>
                  <p>
                    A breathtaking original score, full voice cast, and next-gen lighting bring every district to life. Whether you're chasing the main story, hunting rare loot, or just losing yourself in a sunset over the skyline — there's always one more reason to stay logged in.
                  </p>
                </div>
              )}

              {tab === "screenshots" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SCREEN_GRADIENTS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="group aspect-video border-2 border-border overflow-hidden relative hover:border-primary transition"
                      style={{ background: bg, boxShadow: "3px 3px 0 0 #1a1a1a" }}
                    >
                      <div className="absolute inset-0 scanlines opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center font-display text-xs text-white/80 opacity-0 group-hover:opacity-100 transition">
                        VIEW {i + 1}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {tab === "specs" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "MINIMUM", color: "var(--brand-purple-2)" },
                    { label: "RECOMMENDED", color: "var(--brand-green-1)" },
                  ].map((col, idx) => (
                    <div
                      key={col.label}
                      className="bg-card border-2 border-border p-5"
                      style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
                    >
                      <div className="font-display text-xs mb-4" style={{ color: col.color }}>
                        {col.label}
                      </div>
                      <dl className="space-y-3 font-heading text-lg">
                        {[
                          ["OS", "Windows 10/11 64-bit"],
                          ["CPU", idx === 0 ? "Intel i5-8400 / Ryzen 5 2600" : "Intel i7-10700 / Ryzen 7 5800X"],
                          ["RAM", idx === 0 ? "12 GB" : "16 GB"],
                          ["GPU", idx === 0 ? "GTX 1060 6GB" : "RTX 3070 / RX 6800"],
                          ["Storage", idx === 0 ? "75 GB HDD" : "75 GB SSD"],
                          ["DirectX", "Version 12"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-border pb-2">
                            <dt className="text-muted-foreground">{k}</dt>
                            <dd className="text-right">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-4">
                  {SAMPLE_REVIEWS.map((r) => (
                    <div
                      key={r.id}
                      className="bg-card border-2 border-border p-4 flex gap-4"
                      style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                    >
                      <div
                        className="h-12 w-12 shrink-0 flex items-center justify-center font-display text-xs text-white border-2 border-[#1a1a1a]"
                        style={{ background: r.color }}
                      >
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-heading text-xl">{r.username}</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < r.rating
                                  ? "fill-[var(--brand-green-1)] text-[var(--brand-green-1)]"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-heading text-lg text-foreground/80 leading-snug">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">// MORE LIKE THIS</div>
          <div className="space-y-4">
            {similar.map((g) => (
              <Link key={g.id} to="/game/$id" params={{ id: g.id }} className="block">
                <GameCard game={g} />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* Trailer modal */}
      <AnimatePresence>
        {trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrailer(false)}
            className="fixed inset-0 bg-background/90 z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-card border-2 border-primary"
              style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <button
                onClick={() => setTrailer(false)}
                className="absolute -top-12 right-0 p-2 bg-card border-2 border-border hover:border-primary"
                aria-label="Close trailer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="h-full w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}>
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-3 fill-white text-white" />
                  <div className="font-display text-sm text-white">TRAILER PLACEHOLDER</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-background/95 z-[100] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 bg-card border-2 border-border hover:border-primary z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl aspect-video border-2 border-primary"
              style={{ background: SCREEN_GRADIENTS[lightbox], boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <div className="h-full w-full scanlines flex items-center justify-center font-display text-sm text-white/80">
                SCREENSHOT {lightbox + 1}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
