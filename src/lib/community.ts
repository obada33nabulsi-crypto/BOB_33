import { GAMES } from "@/lib/games";

export type PatchType = "major" | "patch" | "hotfix" | "dlc";

export type PatchNote = {
  id: string;
  version: string;
  type: PatchType;
  date: string;
  title: string;
  description: string;
  added: string[];
  fixed: string[];
  improved: string[];
  removed: string[];
  devComment?: string;
};

export type Review = {
  id: string;
  username: string;
  initials: string;
  color: string;
  rating: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  hoursPlayed: number;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  isDeveloper?: boolean;
  developerResponse?: {
    studio: string;
    body: string;
    date: string;
  };
};

const PATCH_TEMPLATES: Omit<PatchNote, "id">[] = [
  {
    version: "v2.1.0",
    type: "major",
    date: "April 18, 2026",
    title: "The Shadow Realm Expansion",
    description:
      "Our biggest update yet brings a sprawling new region, two factions, and over 40 quests packed with handcrafted stories.",
    added: [
      "New Shadow Realm region with 40+ quests",
      "Two new playable factions: Ashen Hand & Verdant Choir",
      "Mount system with 6 unique companions",
      "Photo mode with cinematic filters",
    ],
    fixed: [
      "Crash on faction reputation overflow",
      "Quest 'Echoes of Iron' could soft-lock",
    ],
    improved: ["Combat responsiveness on ranged abilities", "Loading times reduced by ~30%"],
    removed: ["Legacy controller mapping screen"],
    devComment: "Thank you to everyone in the public test branch — your bug reports made this possible.",
  },
  {
    version: "v2.0.5",
    type: "hotfix",
    date: "March 29, 2026",
    title: "Stability Hotfix",
    description: "A small but important hotfix targeting crashes reported after the v2.0 launch.",
    added: [],
    fixed: [
      "Memory leak when alt-tabbing during cutscenes",
      "Audio cutting out in Old District",
      "Save corruption on cloud sync edge case",
    ],
    improved: ["Error logging for support tickets"],
    removed: [],
  },
  {
    version: "v2.0.0",
    type: "major",
    date: "March 14, 2026",
    title: "Year Two Launch",
    description:
      "A full year of player feedback rolled into a free upgrade — new skill trees, reworked endgame, and a fresh visual overhaul.",
    added: [
      "Reworked skill trees with 80+ new abilities",
      "Endgame Pinnacle activities",
      "Cross-save between platforms",
    ],
    fixed: ["Dozens of side-quest blockers", "Inventory sort persistence"],
    improved: ["Lighting overhaul on all city districts", "NPC animation blending"],
    removed: ["Old prestige system (auto-converted to new currency)"],
    devComment: "Year Two is our love letter to the community. Onward.",
  },
  {
    version: "v1.9.2",
    type: "patch",
    date: "February 20, 2026",
    title: "Quality of Life Patch",
    description: "Smoothing rough edges based on top community-voted feedback.",
    added: ["Quick-travel from world map", "Marker pinning"],
    fixed: ["UI scaling on ultra-wide", "Subtitle timing in 4 languages"],
    improved: ["Reduced grind on tier-3 crafting"],
    removed: [],
  },
];

const REVIEW_NAMES = [
  ["NeonWolf", "NW", "linear-gradient(135deg, #ea34a9, #7e5ecc)"],
  ["PixelKnight", "PK", "linear-gradient(135deg, #7e5ecc, #d97ee0)"],
  ["VoidRunner", "VR", "linear-gradient(135deg, #df158c, #f453bb)"],
  ["StarforgeQ", "SQ", "linear-gradient(135deg, #64ff00, #98ff55)"],
  ["MidnightAce", "MA", "linear-gradient(135deg, #aa4faf, #ea34a9)"],
  ["ChromaByte", "CB", "linear-gradient(135deg, #353535, #7e5ecc)"],
  ["AstralMuse", "AM", "linear-gradient(135deg, #ea34a9, #f453bb)"],
  ["IronVerse", "IV", "linear-gradient(135deg, #7e5ecc, #64ff00)"],
] as const;

const REVIEW_BODIES = [
  {
    rating: 5,
    title: "An absolute masterpiece",
    body: "Easily one of my favourite games of the year. The world feels handcrafted and every side quest tells a story worth listening to. I lost a weekend to this and I'd do it again.",
    pros: ["Stunning art direction", "Memorable cast", "Combat feels great"],
    cons: ["Map can feel dense at first"],
    hours: 124,
  },
  {
    rating: 4,
    title: "Great with small caveats",
    body: "Loving the core loop and the character builds, but a few of the late-game encounters feel unbalanced. Devs are responsive on the forums though, which counts for a lot.",
    pros: ["Deep build variety", "Active developer", "Beautiful soundtrack"],
    cons: ["Late-game spikes", "Inventory could be cleaner"],
    hours: 67,
  },
  {
    rating: 5,
    title: "Worth every penny",
    body: "I bought it on launch and the value just keeps growing with every patch. The community is friendly and the matchmaking finds games fast.",
    pros: ["Generous content updates", "Fast matchmaking"],
    cons: [],
    hours: 203,
  },
  {
    rating: 3,
    title: "Good, but rough on launch",
    body: "Underneath the bugs there's a great game here. Performance has improved a lot since release, but some quests are still finicky.",
    pros: ["Strong core gameplay", "Improving fast"],
    cons: ["Quest bugs", "Occasional frame drops"],
    hours: 31,
  },
  {
    rating: 5,
    title: "I can't put it down",
    body: "Three nights in a row of 'just one more quest'. The story hooks you immediately and the music is permanently in my head now.",
    pros: ["Addictive loop", "Top-tier music"],
    cons: ["Sleep is overrated apparently"],
    hours: 88,
  },
  {
    rating: 4,
    title: "Solid recommendation for genre fans",
    body: "If you've been waiting for something to scratch the itch, this delivers. Expect a slow first hour, but it opens up beautifully.",
    pros: ["Rewards patience", "Replayable"],
    cons: ["Slow opening"],
    hours: 52,
  },
  {
    rating: 2,
    title: "Not for me",
    body: "Performance is fine and the art is great, but the moment-to-moment gameplay didn't click. Refunded — not bad, just not for everyone.",
    pros: ["Beautiful visuals"],
    cons: ["Combat felt floaty to me", "Tutorial too long"],
    hours: 4,
  },
  {
    rating: 5,
    title: "Devs actually listen",
    body: "Every patch hits the things players are talking about. Easy recommend, and I'll buy whatever they ship next.",
    pros: ["Responsive devs", "Constant improvements"],
    cons: [],
    hours: 156,
  },
];

const REVIEW_DATES = [
  "April 19, 2026",
  "April 12, 2026",
  "April 4, 2026",
  "March 28, 2026",
  "March 15, 2026",
  "March 2, 2026",
  "February 19, 2026",
  "February 5, 2026",
];

function seedFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const cache = new Map<string, { patches: PatchNote[]; reviews: Review[] }>();

export function getCommunity(gameId: string) {
  if (cache.has(gameId)) return cache.get(gameId)!;
  const seed = seedFor(gameId);

  const patches: PatchNote[] = PATCH_TEMPLATES.map((p, i) => ({
    ...p,
    id: `${gameId}-patch-${i}`,
  }));

  const reviews: Review[] = REVIEW_BODIES.map((r, i) => {
    const [username, initials, color] = REVIEW_NAMES[(i + seed) % REVIEW_NAMES.length];
    return {
      id: `${gameId}-review-${i}`,
      username,
      initials,
      color,
      rating: r.rating,
      title: r.title,
      body: r.body,
      pros: r.pros,
      cons: r.cons,
      hoursPlayed: r.hours,
      date: REVIEW_DATES[i % REVIEW_DATES.length],
      verified: i % 4 !== 3,
      helpful: 40 + ((seed + i * 23) % 400),
      notHelpful: 1 + ((seed + i * 7) % 30),
      developerResponse:
        i === 1
          ? {
              studio: "Neon Studios",
              body: "Thanks for the detailed feedback — the late-game balance pass is shipping in the next patch!",
              date: "April 14, 2026",
            }
          : undefined,
    };
  });

  const result = { patches, reviews };
  cache.set(gameId, result);
  return result;
}

export function ratingSummary(reviews: Review[]) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const buckets = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    buckets[Math.max(0, Math.min(4, Math.round(r.rating) - 1))]++;
  });
  const breakdown = buckets
    .map((c, i) => ({ stars: i + 1, count: c, pct: total ? Math.round((c / total) * 100) : 0 }))
    .reverse();
  const recommend = total
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / total) * 100)
    : 0;
  // Inflate review count display to match copy style
  const displayCount = 1800 + (seedFor(reviews[0]?.id ?? "x") % 1500);
  return { avg: +avg.toFixed(1), total, breakdown, recommend, displayCount };
}

// Quick warm-up so all games have rating data available synchronously
GAMES.forEach((g) => getCommunity(g.id));
