// Real screenshot URLs mapped per game ID. Falls back to gradient placeholders
// if a game has no entry (e.g. newly published indie titles).

export const gameScreenshots: Record<string, string[]> = {
  "cyber-odyssey": [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1280&h=720&fit=crop",
  ],
  "shadow-realm": [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1280&h=720&fit=crop",
  ],
  "nova-protocol": [
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1280&h=720&fit=crop",
  ],
  "iron-dynasty": [
    "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1280&h=720&fit=crop",
  ],
  "void-hunters": [
    "https://images.unsplash.com/photo-1608306448197-e83633f1261c?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1616509091215-57bbece91654?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1280&h=720&fit=crop",
  ],
  "eternal-fortress": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1280&h=720&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&h=720&fit=crop",
  ],
};

export const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #ea34a9, #7e5ecc)",
  "linear-gradient(135deg, #7e5ecc, #d97ee0)",
  "linear-gradient(135deg, #df158c, #f453bb)",
  "linear-gradient(135deg, #64ff00, #98ff55)",
  "linear-gradient(135deg, #aa4faf, #ea34a9)",
  "linear-gradient(135deg, #353535, #7e5ecc)",
];

export type Shot = { url?: string; gradient?: string };

export function getScreenshots(gameId: string, uploaded?: string[]): Shot[] {
  const sources = uploaded && uploaded.length > 0 ? uploaded : gameScreenshots[gameId] ?? [];
  const shots: Shot[] = sources.slice(0, 6).map((url) => ({ url }));
  while (shots.length < 6) {
    shots.push({ gradient: FALLBACK_GRADIENTS[shots.length % FALLBACK_GRADIENTS.length] });
  }
  return shots;
}
