import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Trash2, Search, CheckCircle2, Library as LibraryIcon } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your Library — Umbrella" },
      { name: "description", content: "All your purchased games in one place. Install and play." },
      { property: "og:title", content: "Your Library — Umbrella" },
      { property: "og:description", content: "All your purchased games in one place." },
    ],
  }),
  component: LibraryPage,
});

type Filter = "all" | "installed" | "not_installed";

function LibraryPage() {
  const { library, getGame, toggleInstalled, removeFromLibrary } = useShop();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    return library
      .map((entry) => ({ entry, game: getGame(entry.id) }))
      .filter((x) => x.game)
      .filter((x) => {
        if (filter === "installed") return x.entry.installed;
        if (filter === "not_installed") return !x.entry.installed;
        return true;
      })
      .filter((x) => x.game!.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.entry.purchasedAt - a.entry.purchasedAt);
  }, [library, getGame, filter, query]);

  const installedCount = library.filter((l) => l.installed).length;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-[10px] tracking-wider text-muted-foreground mb-2">
            YOUR COLLECTION
          </div>
          <h1 className="font-display text-3xl text-gradient-pink">LIBRARY</h1>
          <p className="font-heading text-xl text-muted-foreground mt-2">
            {library.length} {library.length === 1 ? "game" : "games"} owned ·{" "}
            <span className="text-[var(--brand-green-1)]">{installedCount} installed</span>
          </p>
        </div>

        {library.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-input px-3 py-2 border-2 border-border focus-within:border-primary">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH LIBRARY..."
                className="bg-transparent font-heading text-lg outline-none w-48"
              />
            </div>
            {(["all", "installed", "not_installed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 font-display text-[10px] tracking-wider border-2 transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                {f === "not_installed" ? "NOT INSTALLED" : f.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {library.length === 0 && <EmptyLibrary />}

      {/* Grid */}
      {library.length > 0 && items.length === 0 && (
        <div className="text-center py-16">
          <p className="font-heading text-xl text-muted-foreground">No games match your filter.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {items.map(({ entry, game }) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group bg-card border-2 border-border hover:border-primary transition flex flex-col"
                style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
              >
                <Link
                  to="/game/$id"
                  params={{ id: game!.id }}
                  className="relative block aspect-[16/9] overflow-hidden border-b-2 border-border"
                >
                  <img
                    src={game!.cover}
                    alt={game!.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {entry.installed && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] px-2 py-1 font-display text-[9px] tracking-wider border-2 border-[#1a1a1a]">
                      <CheckCircle2 className="h-3 w-3" /> INSTALLED
                    </div>
                  )}
                </Link>

                <div className="p-3 flex-1 flex flex-col gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading text-2xl truncate">{game!.title}</h3>
                    <div className="text-xs text-muted-foreground truncate">
                      {game!.genres.join(" · ")}
                    </div>
                  </div>

                  <div className="text-[10px] font-display tracking-wider text-muted-foreground mt-1">
                    PURCHASED {new Date(entry.purchasedAt).toLocaleDateString()} · {entry.orderId}
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    {entry.installed ? (
                      <button
                        onClick={() => toast.success(`Launching ${game!.title}...`)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider pixel-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                      >
                        <Play className="h-3.5 w-3.5" fill="currentColor" /> PLAY
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toggleInstalled(entry.id);
                          toast.success(`${game!.title} installed`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                      >
                        <Download className="h-3.5 w-3.5" /> INSTALL
                      </button>
                    )}

                    {entry.installed && (
                      <button
                        onClick={() => {
                          toggleInstalled(entry.id);
                          toast(`${game!.title} uninstalled`);
                        }}
                        className="px-2.5 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider transition"
                        title="Uninstall"
                      >
                        UNINST.
                      </button>
                    )}

                    <button
                      onClick={() => {
                        removeFromLibrary(entry.id);
                        toast(`Removed ${game!.title} from library`);
                      }}
                      className="p-2 border-2 border-border hover:border-destructive hover:text-destructive transition"
                      aria-label="Remove from library"
                      title="Remove from library"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div className="text-center py-20 bg-card border-2 border-border" style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}>
      <div
        className="h-24 w-24 mx-auto mb-6 flex items-center justify-center bg-primary/15 border-2 border-[#1a1a1a]"
        style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
      >
        <LibraryIcon className="h-12 w-12 text-primary" />
      </div>
      <h2 className="font-display text-base text-gradient-pink mb-2">YOUR LIBRARY IS EMPTY</h2>
      <p className="font-heading text-xl text-muted-foreground mb-6">
        Complete a purchase and your games will appear here.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-5 py-3 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
      >
        BROWSE GAMES
      </Link>
    </div>
  );
}
