import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DollarSign, Heart, Users, TrendingUp, Plus, X, Edit3, BarChart3, FileText } from "lucide-react";
import { toast } from "sonner";
import { GAMES } from "@/lib/games";
import type { PatchType } from "@/lib/community";

export const Route = createFileRoute("/developer/dashboard")({
  head: () => ({
    meta: [
      { title: "Developer Dashboard — Umbrella" },
      { name: "description", content: "Manage your published games, sales, and patch notes." },
    ],
  }),
  component: DashboardPage,
});

const STATUSES = [
  { id: "live", label: "Live", color: "var(--brand-green-1)" },
  { id: "review", label: "Under Review", color: "var(--brand-pink-1)" },
  { id: "draft", label: "Draft", color: "var(--brand-purple-1)" },
] as const;

function DashboardPage() {
  const myGames = useMemo(
    () =>
      GAMES.slice(0, 4).map((g, i) => ({
        ...g,
        status: (["live", "live", "review", "draft"] as const)[i],
      })),
    [],
  );

  const [patchModalGame, setPatchModalGame] = useState<string | null>(null);

  // Sales chart sample data
  const sales = useMemo(() => {
    const arr: number[] = [];
    let v = 80;
    for (let i = 0; i < 30; i++) {
      v += (Math.random() - 0.4) * 30;
      arr.push(Math.max(20, Math.round(v)));
    }
    return arr;
  }, []);
  const max = Math.max(...sales);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">
            // DEVELOPER DASHBOARD
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-gradient-pink">YOUR STUDIO</h1>
        </div>
        <Link
          to="/developer/publish"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
        >
          <Plus className="h-4 w-4" /> NEW GAME
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: DollarSign, label: "REVENUE", value: "$48,210" },
          { icon: TrendingUp, label: "SALES", value: "1,284" },
          { icon: Heart, label: "WISHLISTS", value: "9,432" },
          { icon: Users, label: "ACTIVE PLAYERS", value: "2,108" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-card border-2 border-border p-4"
              style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
            >
              <Icon className="h-5 w-5 text-primary mb-2" />
              <div className="font-display text-xl text-gradient-pink">{s.value}</div>
              <div className="font-display text-[10px] tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div
        className="bg-card border-2 border-border p-6 mb-10"
        style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display text-[10px] tracking-wider text-primary">// SALES</div>
            <div className="font-heading text-2xl">Last 30 Days</div>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <svg viewBox="0 0 600 160" className="w-full h-40">
          <defs>
            <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ea34a9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ea34a9" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const points = sales
              .map((v, i) => `${(i / (sales.length - 1)) * 600},${160 - (v / max) * 140}`)
              .join(" ");
            const area = `0,160 ${points} 600,160`;
            return (
              <>
                <polygon points={area} fill="url(#line-grad)" />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#ea34a9"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </>
            );
          })()}
        </svg>
      </div>

      {/* Games list */}
      <div className="mb-6">
        <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">
          // YOUR GAMES
        </div>
        <div className="space-y-3">
          {myGames.map((g) => {
            const status = STATUSES.find((s) => s.id === g.status)!;
            return (
              <div
                key={g.id}
                className="bg-card border-2 border-border p-4 flex flex-wrap items-center gap-4"
                style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
              >
                <img
                  src={g.cover}
                  alt={g.title}
                  className="h-16 w-24 object-cover border-2 border-border"
                />
                <div className="flex-1 min-w-[180px]">
                  <div className="font-display text-sm">{g.title.toUpperCase()}</div>
                  <div className="font-heading text-lg text-muted-foreground">
                    {g.genres.join(" · ")}
                  </div>
                </div>
                <span
                  className="px-2 py-1 font-display text-[10px] tracking-wider text-[var(--gray-deep)]"
                  style={{ background: status.color }}
                >
                  {status.label.toUpperCase()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast("Edit screen coming soon")}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
                  >
                    <Edit3 className="h-3 w-3" /> EDIT
                  </button>
                  <button
                    onClick={() => setPatchModalGame(g.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
                  >
                    <FileText className="h-3 w-3" /> PATCH
                  </button>
                  <Link
                    to="/game/$id"
                    params={{ id: g.id }}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
                  >
                    <BarChart3 className="h-3 w-3" /> VIEW
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {patchModalGame && (
        <PatchNoteModal gameId={patchModalGame} onClose={() => setPatchModalGame(null)} />
      )}
    </motion.div>
  );
}

function PatchNoteModal({ gameId, onClose }: { gameId: string; onClose: () => void }) {
  const [version, setVersion] = useState("v");
  const [type, setType] = useState<PatchType>("patch");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);
  const [improved, setImproved] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);

  const game = GAMES.find((g) => g.id === gameId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/90 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-2 border-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-border sticky top-0 bg-card z-10">
          <div>
            <div className="font-display text-[10px] tracking-wider text-primary">
              // ADD PATCH NOTE
            </div>
            <div className="font-heading text-xl">{game?.title}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-display text-[10px] tracking-wider text-primary mb-1">
                VERSION
              </div>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
                placeholder="v1.2.0"
              />
            </div>
            <div>
              <div className="font-display text-[10px] tracking-wider text-primary mb-1">TYPE</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PatchType)}
                className="w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
              >
                <option value="major">Major Update</option>
                <option value="patch">Patch</option>
                <option value="hotfix">Hotfix</option>
                <option value="dlc">DLC</option>
              </select>
            </div>
          </div>
          <div>
            <div className="font-display text-[10px] tracking-wider text-primary mb-1">TITLE</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <div className="font-display text-[10px] tracking-wider text-primary mb-1">
              DESCRIPTION
            </div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
            />
          </div>

          <DynamicList label="✅ ADDED" items={added} setItems={setAdded} />
          <DynamicList label="🔧 FIXED" items={fixed} setItems={setFixed} />
          <DynamicList label="⚡ IMPROVED" items={improved} setItems={setImproved} />
          <DynamicList label="❌ REMOVED" items={removed} setItems={setRemoved} />

          <div className="flex justify-between gap-2 pt-3 border-t-2 border-border">
            <button
              onClick={() => toast("Preview ready!")}
              className="px-4 py-2 bg-card border-2 border-border hover:border-primary font-display text-[10px] tracking-wider"
            >
              PREVIEW
            </button>
            <button
              onClick={() => {
                toast.success("Patch note published!");
                onClose();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
            >
              PUBLISH
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DynamicList({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: (v: string[]) => void;
}) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="font-display text-[10px] tracking-wider text-primary mb-1">{label}</div>
      <div className="flex gap-2 mb-2">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && v.trim()) {
              setItems([...items, v.trim()]);
              setV("");
            }
          }}
          className="flex-1 px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
          placeholder="Add an item and press Enter"
        />
        <button
          onClick={() => {
            if (v.trim()) {
              setItems([...items, v.trim()]);
              setV("");
            }
          }}
          className="px-3 py-2 bg-card border-2 border-border hover:border-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-1.5 bg-input border-2 border-border font-heading text-lg"
            >
              <span>{it}</span>
              <button
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
