import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { GAMES, priceAfterDiscount } from "@/lib/games";
import { useShop } from "@/store/shop";

const SLIDES = GAMES.slice(0, 4);

export default function FeaturedCarousel() {
  const [idx, setIdx] = useState(0);
  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const game = SLIDES[idx];
  const isWished = wishlist.includes(game.id);

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-heading uppercase tracking-[0.3em] text-primary mb-2">Trending now</div>
          <h2 className="font-display text-4xl md:text-5xl">Featured Games</h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % SLIDES.length)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden glass">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img src={game.cover} alt={game.title} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-xl">
              {game.discount && (
                <div className="inline-block px-3 py-1 mb-4 rounded bg-accent text-accent-foreground font-heading font-bold text-sm tracking-wider glow-purple">
                  -{game.discount}% LIMITED
                </div>
              )}
              <h3 className="font-display text-5xl md:text-6xl mb-3 text-gradient-neon">{game.title}</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm">{game.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">{game.genres.join(" · ")}</span>
              </div>
              <p className="text-foreground/80 mb-6 max-w-md">{game.description}</p>
              <div className="flex items-center gap-3">
                <button onClick={() => addToCart(game.id)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--gradient-neon)] text-primary-foreground font-heading font-bold uppercase tracking-wider text-sm glow-cyan hover:scale-105 transition">
                  <Plus className="h-4 w-4" /> ${priceAfterDiscount(game)}
                </button>
                <button onClick={() => toggleWishlist(game.id)} className="h-11 w-11 rounded-md glass flex items-center justify-center hover:border-primary/50 transition">
                  <Heart className={`h-4 w-4 ${isWished ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-4 right-6 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary glow-cyan" : "w-2 bg-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
