import { motion } from "framer-motion";
import { GAMES } from "@/lib/games";
import GameCard from "./GameCard";

export default function CatalogGrid() {
  return (
    <section id="catalog" className="container mx-auto px-4 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs font-heading uppercase tracking-[0.3em] text-primary mb-2">Discover</div>
          <h2 className="font-display text-4xl md:text-5xl">Top Picks</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {GAMES.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.07 }}
          >
            <GameCard game={g} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
