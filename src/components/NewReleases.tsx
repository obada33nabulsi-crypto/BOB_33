import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GAMES } from "@/lib/games";
import GameCard from "./GameCard";

export default function NewReleases() {
  const scroller = useRef<HTMLDivElement>(null);
  const releases = [...GAMES].sort((a) => (a.isNew ? -1 : 1));

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-heading uppercase tracking-[0.3em] text-primary mb-2">Just Dropped</div>
          <h2 className="font-display text-4xl md:text-5xl">New Releases</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={scroller} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {releases.map((g) => (
          <div key={g.id} className="shrink-0 w-64 snap-start">
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </section>
  );
}
