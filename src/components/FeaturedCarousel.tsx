import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { GAMES, priceAfterDiscount } from "@/lib/games";
import { useShop } from "@/store/shop";
import cartIcon from "@/assets/icon-cart.png";
import heartIcon from "@/assets/icon-heart.png";

const SLIDES = GAMES.slice(0, 4);

export default function FeaturedCarousel() {
  const [idx, setIdx] = useState(0);
  const { toggleWishlist, wishlist } = useShop();

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
          <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">// TRENDING NOW</div>
          <h2 className="font-display text-2xl md:text-4xl">FEATURED GAMES</h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)} className="h-10 w-10 bg-card border-2 border-border flex items-center justify-center hover:border-primary transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % SLIDES.length)} className="h-10 w-10 bg-card border-2 border-border flex items-center justify-center hover:border-primary transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[420px] md:h-[480px] overflow-hidden border-2 border-border" style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}>
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
            <div className="absolute inset-0 scanlines opacity-20" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-xl">
              {game.discount && (
                <div className="inline-block px-3 py-1 mb-4 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider">
                  -{game.discount}% LIMITED
                </div>
              )}
              <Link to="/game/$id" params={{ id: game.id }}>
                <h3 className="font-display text-3xl md:text-5xl mb-4 text-gradient-pink leading-tight hover:opacity-90 transition">{game.title}</h3>
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[var(--brand-green-1)] text-[var(--brand-green-1)]" />
                  <span className="font-heading text-lg">{game.rating}</span>
                </div>
                <span className="font-heading text-lg text-muted-foreground">{game.genres.join(" · ")}</span>
              </div>
              <p className="font-heading text-xl text-foreground/80 mb-6 max-w-md leading-tight">{game.description}</p>
              <div className="flex items-center gap-3">
                <Link to="/game/$id" params={{ id: game.id }} className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
                  <img src={cartIcon} alt="" className="pixel-img h-5 w-5" /> ${priceAfterDiscount(game)}
                </Link>
                <button onClick={() => { toggleWishlist(game.id); toast(isWished ? "Removed from wishlist" : "Added to wishlist"); }} className="h-12 w-12 bg-card border-2 border-border flex items-center justify-center hover:border-primary transition">
                  <img src={heartIcon} alt="" className={`pixel-img h-5 w-5 ${isWished ? "opacity-100" : "opacity-40 grayscale"}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 right-6 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
