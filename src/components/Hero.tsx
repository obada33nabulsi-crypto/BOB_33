import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { HERO_IMAGE } from "@/lib/games";
import { useShop } from "@/store/shop";
import { useUI } from "@/store/ui";
import TrailerModal from "@/components/TrailerModal";
import cartIcon from "@/assets/icon-cart.png";

export default function Hero() {
  const { addToCart } = useShop();
  const { bumpCart } = useUI();
  const [scrollY, setScrollY] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="relative min-h-[92vh] overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0003})` }}
      >
        <img
          src={HERO_IMAGE}
          alt="Cyber Odyssey featured game"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Scanlines + scan line */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-[92vh] flex items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-2 glass pixel-border font-display text-[10px] tracking-[0.2em] text-primary mb-6"
          >
            FEATURED · NOW PLAYING
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl leading-[1.05] mb-6"
          >
            Crimson
            <br />
            <span className="text-gradient-pink">Desert</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-2xl text-muted-foreground mb-6 max-w-lg leading-tight"
          >
            Step into a neon-soaked metropolis where every alley hides a secret and every choice rewrites the future. The most ambitious open world of the decade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-[var(--brand-green-1)] text-[var(--brand-green-1)]" : "text-muted-foreground"}`} />
              ))}
              <span className="ml-2 font-heading text-lg text-muted-foreground">4.8 · 24.3K REVIEWS</span>
            </div>
            <div className="px-3 py-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider">
              -60% OFF
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => {
                const added = addToCart("crimson-Desert");
                if (added) { bumpCart(); toast.success("Crimson Desert added to cart!"); }
                else toast("Already in your cart!");
              }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
            >
              <img src={cartIcon} alt="" className="pixel-img h-5 w-5" />
              ADD TO CART
              <span className="ml-2 px-2 py-1 bg-[var(--gray-deep)]/40 text-[10px]">$23.99</span>
              <span className="text-[10px] line-through opacity-60">$59.99</span>
            </button>
            <button
              onClick={() => setTrailerOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 glass pixel-border text-foreground font-display text-xs tracking-wider hover:border-primary transition"
              style={{ boxShadow: "0 0 24px rgba(0,245,255,0.35)" }}
            >
              <Play className="h-4 w-4 fill-current" /> WATCH TRAILER
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} gameId="crimson-Desert" />
    </section>
  );
}
