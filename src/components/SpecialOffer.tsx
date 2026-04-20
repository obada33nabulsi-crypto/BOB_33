import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export default function SpecialOffer() {
  const target = useState(() => Date.now() + 1000 * 60 * 60 * 23 + 1000 * 60 * 47)[0];
  const { h, m, s } = useCountdown(target);

  const cells = [
    { l: "Hours", v: h },
    { l: "Minutes", v: m },
    { l: "Seconds", v: s },
  ];

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 animate-pulse-neon" style={{ background: "var(--gradient-card)" }}>
        <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-60" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/50 text-accent text-xs font-heading uppercase tracking-[0.2em] mb-4">
              <Flame className="h-3 w-3" /> Flash Deal
            </div>
            <h2 className="font-display text-4xl md:text-5xl mb-2">
              Up to <span className="text-gradient-neon">75% OFF</span>
            </h2>
            <p className="text-muted-foreground max-w-md">Massive discounts on AAA blockbusters. When the timer hits zero, the deals vanish.</p>
          </div>

          <div className="flex gap-3">
            {cells.map((c) => (
              <div key={c.l} className="w-20 md:w-24">
                <div className="aspect-square rounded-lg glass flex items-center justify-center font-display text-4xl md:text-5xl text-gradient-neon">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-heading">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
