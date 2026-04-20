import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_IMAGE } from "@/lib/games";
import { useShop } from "@/store/shop";
import cartIcon from "@/assets/icon-cart.png";
import controllerIcon from "@/assets/icon-controller.png";

export default function Hero() {
  const { addToCart } = useShop();
  const [scrollY, setScrollY] = useState(0);

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

      {/* Animated scan line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-[92vh] flex items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-heading uppercase tracking-[0.2em] text-primary mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Featured Release
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl leading-[0.9] mb-4"
          >
            CYBER
            <br />
            <span className="text-gradient-neon">ODYSSEY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-6 max-w-lg"
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
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">4.8 · 24.3k reviews</span>
            </div>
            <div className="px-3 py-1 rounded bg-accent/20 border border-accent/50 text-xs font-heading font-bold uppercase tracking-wider text-accent">
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
              onClick={() => addToCart("cyber-odyssey")}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--gradient-neon)] text-primary-foreground font-heading font-bold uppercase tracking-wider text-sm glow-cyan hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4" /> Add to Cart
              <span className="ml-2 px-2 py-0.5 rounded bg-background/30 text-xs">$23.99</span>
              <span className="ml-1 text-xs line-through opacity-60">$59.99</span>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-md glass text-foreground font-heading font-bold uppercase tracking-wider text-sm hover:bg-primary/10 hover:border-primary/50 transition">
              <Play className="h-4 w-4 fill-current" /> Watch Trailer
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
