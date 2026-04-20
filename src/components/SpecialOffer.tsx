import { useEffect, useState } from "react";
import trophyIcon from "@/assets/icon-trophy.png";

const INITIAL = { h: 23, m: 47, s: 0 };

function useCountdown() {
  const [time, setTime] = useState(INITIAL);
  useEffect(() => {
    const target = Date.now() + 1000 * 60 * 60 * 23 + 1000 * 60 * 47;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function SpecialOffer() {
  const { h, m, s } = useCountdown();

  const cells = [
    { l: "HOURS", v: h },
    { l: "MINS", v: m },
    { l: "SECS", v: s },
  ];

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="relative overflow-hidden p-8 md:p-12 animate-pulse-neon border-2 border-primary bg-card">
        <div className="absolute inset-0 scanlines opacity-20" />
        <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-60" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-[0.2em] mb-4">
              <img src={trophyIcon} alt="" className="pixel-img h-4 w-4" /> FLASH DEAL
            </div>
            <h2 className="font-display text-2xl md:text-4xl mb-3 leading-tight">
              UP TO <span className="text-gradient-pink">75% OFF</span>
            </h2>
            <p className="font-heading text-xl text-muted-foreground max-w-md">Massive discounts on AAA blockbusters. When the timer hits zero, the deals vanish.</p>
          </div>

          <div className="flex gap-3">
            {cells.map((c) => (
              <div key={c.l} className="w-20 md:w-24">
                <div className="aspect-square bg-[var(--gray-deep)] border-2 border-primary flex items-center justify-center font-display text-2xl md:text-3xl text-primary">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="text-center font-display text-[10px] tracking-widest text-muted-foreground mt-2">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
