import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  X,
  ChevronRight,
  Bell,
  Share2,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Check,
  AlertCircle,
  Zap,
  XCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { GAMES, priceAfterDiscount, type Game } from "@/lib/games";
import { getCommunity, ratingSummary, type PatchType, type Review } from "@/lib/community";
import { useShop } from "@/store/shop";
import { useUI } from "@/store/ui";
import GameCard from "@/components/GameCard";
import ScreenshotsGallery from "@/components/ScreenshotsGallery";
import cartIcon from "@/assets/icon-cart.png";
import heartIcon from "@/assets/icon-heart.png";

export const Route = createFileRoute("/game/$id")({
  loader: ({ params }) => {
    const game = GAMES.find((g) => g.id === params.id);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.game.title} — Umbrella` },
          { name: "description", content: loaderData.game.description },
          { property: "og:title", content: `${loaderData.game.title} — Umbrella` },
          { property: "og:description", content: loaderData.game.description },
          { property: "og:image", content: loaderData.game.cover },
        ]
      : [],
  }),
  component: GamePage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="font-display text-2xl mb-4">GAME NOT FOUND</h1>
      <Link to="/" className="text-primary font-heading text-xl hover:underline">
        ← Back to store
      </Link>
    </div>
  ),
});

type Tab = "overview" | "screenshots" | "patches" | "specs" | "reviews";

function GamePage() {
  const { game } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, library } = useShop();
  const { bumpCart } = useUI();
  const [tab, setTab] = useState<Tab>("overview");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [trailer, setTrailer] = useState(false);

  const isWished = wishlist.includes(game.id);
  const finalPrice = priceAfterDiscount(game);
  const similar = GAMES.filter((g: Game) => g.id !== game.id).slice(0, 3);
  const owns = library.some((l) => l.id === game.id);
  const community = getCommunity(game.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden border-b-2 border-border">
        <div className="absolute inset-0">
          <img src={game.cover} alt={game.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 scanlines opacity-20" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 pt-8 pb-12">
          <nav className="flex items-center gap-2 font-heading text-lg text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition">HOME</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition cursor-pointer">{game.genres[0]?.toUpperCase()}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{game.title.toUpperCase()}</span>
          </nav>

          <div className="max-w-2xl pt-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {game.genres.map((g: string) => (
                <span key={g} className="px-2 py-1 bg-secondary text-secondary-foreground font-display text-[10px] tracking-wider">
                  {g.toUpperCase()}
                </span>
              ))}
              {game.discount && (
                <span className="px-2 py-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider">
                  -{game.discount}%
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-gradient-pink leading-tight mb-4">
              {game.title.toUpperCase()}
            </h1>
            <div className="font-heading text-lg text-muted-foreground mb-6">
              By NEON STUDIOS · Released MAR 14, 2025
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[var(--brand-green-1)] text-[var(--brand-green-1)]" />
                <span className="font-heading text-lg">{game.rating}</span>
              </div>
              <span className="font-heading text-lg text-muted-foreground">12.4K REVIEWS</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTrailer(true)}
                className="inline-flex items-center gap-2 px-5 py-3 glass pixel-border text-foreground font-display text-xs tracking-wider hover:border-primary transition"
              >
                <Play className="h-4 w-4 fill-current" /> WATCH TRAILER
              </button>
              <button
                onClick={() => {
                  const added = addToCart(game.id);
                  if (added) { bumpCart(); toast.success(`${game.title} added to cart!`); }
                  else toast("Already in your cart!");
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
              >
                <img src={cartIcon} alt="" className="pixel-img h-5 w-5" />
                ADD TO CART · ${finalPrice}
                {game.discount && <span className="text-[10px] line-through opacity-60 ml-1">${game.price}</span>}
              </button>
              <button
                onClick={() => { toggleWishlist(game.id); toast(isWished ? "Removed from wishlist" : "Added to wishlist"); }}
                className="h-12 w-12 bg-card border-2 border-border flex items-center justify-center hover:border-primary transition"
                aria-label="Wishlist"
              >
                <img src={heartIcon} alt="" className={`pixel-img h-5 w-5 ${isWished ? "opacity-100" : "opacity-40 grayscale"}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-4 lg:px-8 py-12 grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* Tabs */}
          <div className="flex flex-wrap border-b-2 border-border mb-6">
            {([
              ["overview", "Overview"],
              ["screenshots", "Screenshots"],
              ["patches", "Patch Notes"],
              ["specs", "System Reqs"],
              ["reviews", "Reviews"],
            ] as [Tab, string][]).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-3 font-display text-[11px] tracking-wider transition border-b-2 -mb-0.5 ${
                  tab === k
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "overview" && (
                <div className="space-y-4 font-heading text-xl text-foreground/80 leading-relaxed">
                  <p>{game.description}</p>
                  <p>
                    Forge your destiny across a sprawling open world packed with handcrafted side stories, dynamic faction battles, and choices that ripple through every chapter. The signature combat system blends fluid melee with explosive ranged abilities, letting you build a playstyle as bold as you are.
                  </p>
                  <p>
                    A breathtaking original score, full voice cast, and next-gen lighting bring every district to life. Whether you're chasing the main story, hunting rare loot, or just losing yourself in a sunset over the skyline — there's always one more reason to stay logged in.
                  </p>
                </div>
              )}

              {tab === "screenshots" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SCREEN_GRADIENTS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="group aspect-video border-2 border-border overflow-hidden relative hover:border-primary transition"
                      style={{ background: bg, boxShadow: "3px 3px 0 0 #1a1a1a" }}
                    >
                      <div className="absolute inset-0 scanlines opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center font-display text-xs text-white/80 opacity-0 group-hover:opacity-100 transition">
                        VIEW {i + 1}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {tab === "patches" && <PatchNotesTab gameId={game.id} />}

              {tab === "specs" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "MINIMUM", color: "var(--brand-purple-2)" },
                    { label: "RECOMMENDED", color: "var(--brand-green-1)" },
                  ].map((col, idx) => (
                    <div
                      key={col.label}
                      className="bg-card border-2 border-border p-5"
                      style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
                    >
                      <div className="font-display text-xs mb-4" style={{ color: col.color }}>
                        {col.label}
                      </div>
                      <dl className="space-y-3 font-heading text-lg">
                        {[
                          ["OS", "Windows 10/11 64-bit"],
                          ["CPU", idx === 0 ? "Intel i5-8400 / Ryzen 5 2600" : "Intel i7-10700 / Ryzen 7 5800X"],
                          ["RAM", idx === 0 ? "12 GB" : "16 GB"],
                          ["GPU", idx === 0 ? "GTX 1060 6GB" : "RTX 3070 / RX 6800"],
                          ["Storage", idx === 0 ? "75 GB HDD" : "75 GB SSD"],
                          ["DirectX", "Version 12"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-border pb-2">
                            <dt className="text-muted-foreground">{k}</dt>
                            <dd className="text-right">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <ReviewsTab gameId={game.id} owns={owns} reviews={community.reviews} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">// MORE LIKE THIS</div>
          <div className="space-y-4">
            {similar.map((g) => (
              <Link key={g.id} to="/game/$id" params={{ id: g.id }} className="block">
                <GameCard game={g} />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* Trailer modal */}
      <AnimatePresence>
        {trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrailer(false)}
            className="fixed inset-0 bg-background/90 z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-card border-2 border-primary"
              style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <button
                onClick={() => setTrailer(false)}
                className="absolute -top-12 right-0 p-2 bg-card border-2 border-border hover:border-primary"
                aria-label="Close trailer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="h-full w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ea34a9, #7e5ecc)" }}>
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-3 fill-white text-white" />
                  <div className="font-display text-sm text-white">TRAILER PLACEHOLDER</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-background/95 z-[100] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 bg-card border-2 border-border hover:border-primary z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl aspect-video border-2 border-primary"
              style={{ background: SCREEN_GRADIENTS[lightbox], boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <div className="h-full w-full scanlines flex items-center justify-center font-display text-sm text-white/80">
                SCREENSHOT {lightbox + 1}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== PATCH NOTES =====

const PATCH_TYPE_META: Record<PatchType, { label: string; color: string; icon: string }> = {
  major: { label: "Major Update", color: "#ef4444", icon: "🔴" },
  patch: { label: "Patch", color: "#eab308", icon: "🟡" },
  hotfix: { label: "Hotfix", color: "#64ff00", icon: "🟢" },
  dlc: { label: "DLC", color: "#3b82f6", icon: "🔵" },
};

function PatchNotesTab({ gameId }: { gameId: string }) {
  const { patches } = getCommunity(gameId);
  const [filter, setFilter] = useState<"all" | PatchType>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const visible = patches.filter((p) => filter === "all" || p.type === filter);

  return (
    <div>
      {/* Filter + subscribe */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All Updates"],
              ["major", "Major"],
              ["patch", "Patches"],
              ["hotfix", "Hotfixes"],
              ["dlc", "DLC"],
            ] as const
          ).map(([id, l]) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 border-2 font-display text-[10px] tracking-wider transition ${
                  active
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => toast.success("You'll be notified of updates!")}
          className="inline-flex items-center gap-2 px-3 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
        >
          <Bell className="h-3 w-3" /> SUBSCRIBE
        </button>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l-2 border-border space-y-6">
        {visible.map((p) => {
          const meta = PATCH_TYPE_META[p.type];
          const isOpen = !!expanded[p.id];
          const sections: [string, string[], any, string][] = [
            ["Added", p.added, Check, "var(--brand-green-1)"],
            ["Fixed", p.fixed, AlertCircle, "#eab308"],
            ["Improved", p.improved, Zap, "#22d3ee"],
            ["Removed", p.removed, XCircle, "#ef4444"],
          ];
          return (
            <div key={p.id} className="relative">
              <div
                className="absolute -left-[31px] top-2 h-4 w-4 border-2 border-[#1a1a1a]"
                style={{ background: meta.color }}
              />
              <div
                className="bg-card border-2 border-border p-5"
                style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-input border-2 border-primary font-display text-[10px] tracking-wider text-primary">
                    {p.version}
                  </span>
                  <span
                    className="px-2 py-0.5 font-display text-[10px] tracking-wider text-[var(--gray-deep)]"
                    style={{ background: meta.color }}
                  >
                    {meta.icon} {meta.label.toUpperCase()}
                  </span>
                  <span className="font-heading text-lg text-muted-foreground ml-auto">
                    {p.date}
                  </span>
                </div>
                <h3 className="font-display text-lg text-gradient-pink mb-2">
                  {p.title.toUpperCase()}
                </h3>
                <p className="font-heading text-lg text-foreground/80 leading-snug mb-4">
                  {p.description}
                </p>

                <div className={`grid sm:grid-cols-2 gap-4 ${isOpen ? "" : "max-h-[180px] overflow-hidden relative"}`}>
                  {sections.map(([label, items, Icon, color]) =>
                    items.length === 0 ? null : (
                      <div key={label}>
                        <div
                          className="flex items-center gap-1 font-display text-[10px] tracking-wider mb-1"
                          style={{ color }}
                        >
                          <Icon className="h-3 w-3" /> {label.toUpperCase()}
                        </div>
                        <ul className="space-y-1 font-heading text-lg text-foreground/80">
                          {items.map((it, i) => (
                            <li key={i} className="flex gap-2">
                              <span style={{ color }}>•</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                  {!isOpen && (
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  )}
                </div>

                {p.devComment && isOpen && (
                  <div className="mt-4 p-3 bg-input border-l-2 border-primary">
                    <div className="font-display text-[10px] tracking-wider text-primary mb-1">
                      DEVELOPER COMMENT
                    </div>
                    <p className="font-heading text-lg italic text-foreground/80">
                      "{p.devComment}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => setExpanded((s) => ({ ...s, [p.id]: !isOpen }))}
                    className="inline-flex items-center gap-1 font-heading text-lg text-primary hover:underline"
                  >
                    {isOpen ? "Show less" : "Full patch notes"}
                    <ChevronDown
                      className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`${p.version} — ${p.title}`);
                      toast.success("Patch link copied");
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-input border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
                  >
                    <Share2 className="h-3 w-3" /> SHARE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== REVIEWS =====

function StarRow({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className="relative" style={{ width: size * 4, height: size * 4 }}>
            <Star
              className="absolute inset-0 text-muted-foreground"
              style={{ width: size * 4, height: size * 4 }}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                className="text-[var(--brand-green-1)] fill-[var(--brand-green-1)]"
                style={{ width: size * 4, height: size * 4 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewsTab({
  gameId,
  owns,
  reviews,
}: {
  gameId: string;
  owns: boolean;
  reviews: Review[];
}) {
  const [list, setList] = useState<Review[]>(reviews);
  const [sort, setSort] = useState<"helpful" | "recent" | "high" | "low">("helpful");
  const [filter, setFilter] = useState<"all" | "5" | "critical">("all");
  const [shown, setShown] = useState(5);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

  const summary = useMemo(() => ratingSummary(reviews), [reviews]);

  const sorted = useMemo(() => {
    let arr = [...list];
    if (filter === "5") arr = arr.filter((r) => r.rating === 5);
    if (filter === "critical") arr = arr.filter((r) => r.rating <= 2);
    if (sort === "recent") arr.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "high") arr.sort((a, b) => b.rating - a.rating);
    if (sort === "low") arr.sort((a, b) => a.rating - b.rating);
    if (sort === "helpful") arr.sort((a, b) => b.helpful - a.helpful);
    return arr;
  }, [list, sort, filter]);

  // Write review form state
  const [draft, setDraft] = useState({
    rating: 0,
    hover: 0,
    title: "",
    body: "",
    pros: [] as string[],
    cons: [] as string[],
    proInput: "",
    conInput: "",
  });

  function submitReview() {
    if (draft.rating === 0) return toast.error("Please select a star rating");
    if (draft.body.trim().length < 100)
      return toast.error("Review must be at least 100 characters");
    const r: Review = {
      id: `${gameId}-mine-${Date.now()}`,
      username: "You",
      initials: "PS",
      color: "linear-gradient(135deg, #ea34a9, #7e5ecc)",
      rating: draft.rating,
      title: draft.title || "My review",
      body: draft.body,
      pros: draft.pros,
      cons: draft.cons,
      hoursPlayed: 47.3,
      date: "Just now",
      verified: true,
      helpful: 0,
      notHelpful: 0,
    };
    setList((l) => [r, ...l]);
    setDraft({
      rating: 0,
      hover: 0,
      title: "",
      body: "",
      pros: [],
      cons: [],
      proInput: "",
      conInput: "",
    });
    toast.success("Review posted! 🎉");
  }

  return (
    <div className="space-y-8">
      {/* Rating overview */}
      <div
        className="grid md:grid-cols-[200px_1fr] gap-6 bg-card border-2 border-border p-6"
        style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
      >
        <div className="text-center md:border-r-2 md:border-border md:pr-6">
          <div className="font-display text-4xl text-gradient-pink">{summary.avg}</div>
          <div className="font-heading text-lg text-muted-foreground">/ 5</div>
          <div className="flex justify-center mt-2">
            <StarRow rating={summary.avg} size={5} />
          </div>
          <div className="font-heading text-base text-muted-foreground mt-2">
            ({summary.displayCount.toLocaleString()} reviews)
          </div>
        </div>
        <div>
          <div className="space-y-1.5">
            {summary.breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 font-heading text-lg">
                <span className="w-12 text-muted-foreground">{b.stars}★</span>
                <div className="flex-1 h-3 bg-input border-2 border-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full"
                    style={{
                      background:
                        b.stars >= 4
                          ? "var(--brand-green-1)"
                          : b.stars === 3
                          ? "#eab308"
                          : "var(--brand-pink-1)",
                    }}
                  />
                </div>
                <span className="w-12 text-right text-muted-foreground">{b.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 font-heading text-xl">
            <ThumbsUp className="h-4 w-4 text-[var(--brand-green-1)]" />
            <span>
              <span className="text-[var(--brand-green-1)] font-bold">{summary.recommend}%</span> of
              players recommend this game
            </span>
          </div>
        </div>
      </div>

      {/* Write review */}
      {owns ? (
        <div
          className="bg-card border-2 border-primary p-5"
          style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
        >
          <div className="font-display text-[10px] tracking-wider text-primary mb-3">
            // WRITE YOUR REVIEW
          </div>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setDraft({ ...draft, hover: s })}
                onMouseLeave={() => setDraft({ ...draft, hover: 0 })}
                onClick={() => setDraft({ ...draft, rating: s })}
                className="transition"
              >
                <Star
                  className={`h-7 w-7 transition ${
                    s <= (draft.hover || draft.rating)
                      ? "fill-[var(--brand-green-1)] text-[var(--brand-green-1)] drop-shadow-[0_0_8px_rgba(100,255,0,0.6)]"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Review title"
            className="w-full mb-2 px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
          />
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Share your thoughts (min 100 chars)"
            rows={4}
            className="w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
          />
          <div className="text-right font-heading text-sm text-muted-foreground mb-3">
            {draft.body.length} chars
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <ProConInput
              label="PROS"
              color="var(--brand-green-1)"
              items={draft.pros}
              setItems={(v) => setDraft({ ...draft, pros: v })}
              value={draft.proInput}
              setValue={(v) => setDraft({ ...draft, proInput: v })}
              max={5}
            />
            <ProConInput
              label="CONS"
              color="#ef4444"
              items={draft.cons}
              setItems={(v) => setDraft({ ...draft, cons: v })}
              value={draft.conInput}
              setValue={(v) => setDraft({ ...draft, conInput: v })}
              max={5}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-2 py-1 bg-input border-2 border-border font-display text-[10px] tracking-wider">
              🎮 47.3 HOURS PLAYED
            </span>
            <button
              onClick={submitReview}
              className="px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
            >
              SUBMIT REVIEW
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card border-2 border-border p-4 font-heading text-lg text-muted-foreground">
          Buy this game to write a review.
        </div>
      )}

      {/* Filters + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All Reviews"],
              ["5", "⭐⭐⭐⭐⭐ Only"],
              ["critical", "Critical"],
            ] as const
          ).map(([id, l]) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 border-2 font-display text-[10px] tracking-wider ${
                  active
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {sorted.slice(0, shown).map((r) => {
          const vote = votes[r.id] ?? 0;
          const isOpen = !!expanded[r.id];
          const long = r.body.length > 220;
          return (
            <div
              key={r.id}
              className="bg-card border-2 border-border p-5"
              style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
            >
              <div className="flex gap-4">
                <div className="relative">
                  <div
                    className="h-12 w-12 shrink-0 flex items-center justify-center font-display text-xs text-white border-2 border-[#1a1a1a]"
                    style={{ background: r.color }}
                  >
                    {r.initials}
                  </div>
                  {r.isDeveloper && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1 bg-[var(--brand-purple-1)] text-white font-display text-[8px] tracking-wider border border-[#1a1a1a]">
                      DEV
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-heading text-xl">{r.username}</span>
                    {r.verified && (
                      <span className="px-1.5 py-0.5 bg-[var(--brand-green-1)]/20 text-[var(--brand-green-1)] font-display text-[9px] tracking-wider border border-[var(--brand-green-1)]/40">
                        VERIFIED
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-input font-display text-[9px] tracking-wider text-muted-foreground border border-border">
                      🎮 {r.hoursPlayed} HRS
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <StarRow rating={r.rating} />
                  <div className="font-heading text-xl mt-2 mb-1 font-bold">{r.title}</div>
                  <p
                    className={`font-heading text-lg text-foreground/80 leading-snug ${
                      !isOpen && long ? "line-clamp-3" : ""
                    }`}
                  >
                    {r.body}
                  </p>
                  {long && (
                    <button
                      onClick={() => setExpanded((s) => ({ ...s, [r.id]: !isOpen }))}
                      className="font-heading text-base text-primary hover:underline mt-1"
                    >
                      {isOpen ? "Show less" : "Read more"}
                    </button>
                  )}

                  {(r.pros.length > 0 || r.cons.length > 0) && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      {r.pros.length > 0 && (
                        <ul className="space-y-1">
                          {r.pros.map((p, i) => (
                            <li
                              key={i}
                              className="flex gap-2 font-heading text-lg text-foreground/80"
                            >
                              <Check className="h-4 w-4 text-[var(--brand-green-1)] shrink-0 mt-1" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      {r.cons.length > 0 && (
                        <ul className="space-y-1">
                          {r.cons.map((c, i) => (
                            <li
                              key={i}
                              className="flex gap-2 font-heading text-lg text-foreground/80"
                            >
                              <X className="h-4 w-4 text-[#ef4444] shrink-0 mt-1" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border font-heading text-base">
                    <span className="text-muted-foreground">Was this helpful?</span>
                    <button
                      onClick={() => setVotes((v) => ({ ...v, [r.id]: vote === 1 ? 0 : 1 }))}
                      className={`inline-flex items-center gap-1 px-2 py-1 border-2 transition ${
                        vote === 1
                          ? "border-[var(--brand-green-1)] text-[var(--brand-green-1)]"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" /> {r.helpful + (vote === 1 ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => setVotes((v) => ({ ...v, [r.id]: vote === -1 ? 0 : -1 }))}
                      className={`inline-flex items-center gap-1 px-2 py-1 border-2 transition ${
                        vote === -1
                          ? "border-[#ef4444] text-[#ef4444]"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <ThumbsDown className="h-3 w-3" /> {r.notHelpful + (vote === -1 ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => setReplyOpen(replyOpen === r.id ? null : r.id)}
                      className="ml-auto text-muted-foreground hover:text-primary"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => toast("Reported. Thanks for the heads-up.")}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Report"
                    >
                      <Flag className="h-3 w-3" />
                    </button>
                  </div>

                  {replyOpen === r.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            toast.success("Reply posted");
                            setReplyOpen(null);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          toast.success("Reply posted");
                          setReplyOpen(null);
                        }}
                        className="px-3 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
                      >
                        SEND
                      </button>
                    </div>
                  )}

                  {r.developerResponse && (
                    <div
                      className="mt-4 p-3 border-2 border-[var(--brand-purple-1)]"
                      style={{ background: "rgba(126,94,204,0.1)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-1.5 py-0.5 bg-[var(--brand-purple-1)] text-white font-display text-[9px] tracking-wider">
                          DEVELOPER RESPONSE
                        </span>
                        <span className="font-heading text-lg">{r.developerResponse.studio}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {r.developerResponse.date}
                        </span>
                      </div>
                      <p className="font-heading text-lg text-foreground/80 leading-snug">
                        {r.developerResponse.body}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {shown < sorted.length && (
        <div className="text-center">
          <button
            onClick={() => setShown(shown + 10)}
            className="px-5 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
          >
            LOAD MORE REVIEWS
          </button>
        </div>
      )}
    </div>
  );
}

function ProConInput({
  label,
  color,
  items,
  setItems,
  value,
  setValue,
  max,
}: {
  label: string;
  color: string;
  items: string[];
  setItems: (v: string[]) => void;
  value: string;
  setValue: (v: string) => void;
  max: number;
}) {
  function add() {
    const v = value.trim();
    if (!v || items.includes(v) || items.length >= max) return;
    setItems([...items, v]);
    setValue("");
  }
  return (
    <div>
      <div className="font-display text-[10px] tracking-wider mb-1" style={{ color }}>
        {label} ({items.length}/{max})
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type and Enter"
          className="flex-1 px-2 py-1.5 bg-input border-2 border-border font-heading text-base outline-none focus:border-primary"
        />
        <button
          onClick={add}
          className="px-2 py-1.5 bg-card border-2 border-border hover:border-primary"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 px-2 py-0.5 border-2 font-heading text-base"
              style={{ borderColor: color, color }}
            >
              {p}
              <button onClick={() => setItems(items.filter((x) => x !== p))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
