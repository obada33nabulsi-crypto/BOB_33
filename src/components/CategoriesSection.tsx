import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/games";

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="mb-8">
        <div className="font-display text-[10px] tracking-[0.3em] text-[var(--brand-purple-1)] mb-2">// BROWSE BY</div>
        <h2 className="font-display text-2xl md:text-4xl">CATEGORIES</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.a
            key={c.name}
            href="#catalog"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, x: -2 }}
            className="group relative aspect-square bg-card border-2 border-border flex flex-col items-center justify-center text-center p-4 overflow-hidden hover:border-primary transition"
            style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
          >
            <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-5xl mb-3 relative">{c.icon}</div>
            <div className="font-display text-xs tracking-wider relative">{c.name.toUpperCase()}</div>
            <div className="font-heading text-lg text-muted-foreground mt-1 relative">{c.count.toLocaleString()} GAMES</div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
