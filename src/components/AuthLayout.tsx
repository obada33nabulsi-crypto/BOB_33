import { motion } from "framer-motion";
import { GAMES } from "@/lib/games";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const cards = GAMES.slice(0, 6);
  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0f] text-foreground">
      {/* Left side */}
      <div className="hidden md:flex relative w-[60%] overflow-hidden items-center justify-center"
           style={{ background: "radial-gradient(ellipse at top left, rgba(234,52,169,0.2), transparent 60%), radial-gradient(ellipse at bottom right, rgba(126,94,204,0.25), transparent 60%), #0a0a0f" }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(234,52,169,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(126,94,204,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating cards */}
        {cards.map((g, i) => (
          <motion.div
            key={g.id}
            className="absolute pixel-border overflow-hidden"
            style={{
              left: `${10 + (i * 13) % 70}%`,
              top: `${15 + (i * 17) % 60}%`,
              width: 140,
              height: 180,
            }}
            animate={{ y: [0, -20, 0], rotate: [(i % 2 ? -3 : 3), (i % 2 ? 3 : -3), (i % 2 ? -3 : 3)] }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          >
            <img src={g.cover} alt="" className="w-full h-full object-cover opacity-80" />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        <div className="relative z-10 text-center px-12">
          <h1 className="font-display text-3xl text-gradient-pink mb-4">NexusStore</h1>
          <p className="font-heading text-2xl text-foreground/90">The next-gen game store.</p>
          <p className="mt-6 font-heading text-xl text-muted-foreground">
            Join <span className="text-primary">2.1M+ gamers</span> on NexusStore
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        <div className="absolute inset-0 md:hidden opacity-20 pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(234,52,169,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(126,94,204,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass pixel-border p-6 md:p-8 relative z-10"
          style={{ background: "rgba(20, 20, 28, 0.85)", backdropFilter: "blur(12px)" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
