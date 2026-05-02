// IMAGE IMPORTS
import icon1 from "@/assets/icon2/img.png";
import icon2 from "@/assets/icon2/Untitled02.png";
import icon3 from "@/assets/icon2/Untitled03.png";
import icon4 from "@/assets/icon2/Untitled04.png";
import icon5 from "@/assets/icon2/Untitled05.png";

// TYPE (IMPORTANT for TSX safety)
type Category = {
  name: string;
  icon: string;
  count: number;
};

// DATA
const CATEGORIES: Category[] = [
  { name: "Action", icon: icon1, count: 1284 },
  { name: "RPG", icon: icon2, count: 942 },
  { name: "Strategy", icon: icon3, count: 567 },
  { name: "Indie", icon: icon4, count: 2103 },
  { name: "Free to Play", icon: icon5, count: 318 },
];

// COMPONENT
export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      {/* HEADER */}
      <div className="mb-8">
        <div className="font-display text-[10px] tracking-[0.3em] text-[var(--brand-purple-1)] mb-2">
          // BROWSE BY
        </div>
        <h2 className="font-display text-2xl md:text-4xl">
          CATEGORIES
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((c) => (
          <a
            key={c.name}
            href="#catalog"
            className="group relative aspect-square bg-card border-2 border-border flex flex-col items-center justify-center text-center p-4 overflow-hidden hover:border-primary transition hover:-translate-y-1"
            style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
          >
            {/* glow background */}
            <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* ICON */}
            <img
              src={c.icon}
              alt={c.name}
              className="w-14 h-14 object-contain mb-3 relative"
            />

            {/* NAME */}
            <div className="font-display text-xs tracking-wider relative">
              {c.name.toUpperCase()}
            </div>

            {/* COUNT */}
            <div className="font-heading text-lg text-muted-foreground mt-1 relative">
              {c.count.toLocaleString()} GAMES
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
