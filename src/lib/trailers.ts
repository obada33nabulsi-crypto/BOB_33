const BASE = import.meta.env.BASE_URL ?? "/";

// All games share the same uploaded launch trailer.
const SHARED_TRAILER = `${BASE}videos/trailer_ac_mirage.mp4`;

export const gameTrailers: Record<string, string> = {
  "cyber-odyssey": `${BASE}videos/trailer_ac_mirage.mp4`,
  "shadow-realm": `${BASE}videos/trailer_ac_mirage.mp4`,
  "nova-protocol": `${BASE}videos/trailer_ac_mirage.mp4`,
  "iron-dynasty": `${BASE}videos/trailer_ac_mirage.mp4`,
  "void-hunters": `${BASE}videos/trailer_ac_mirage.mp4`,
  "eternal-fortress": `${BASE}videos/trailer_ac_mirage.mp4`,
};

export const defaultTrailer = SHARED_TRAILER;

/**
 * Resolve the trailer source for a given game id.
 * Accepts an optional custom URL (e.g. uploaded by an indie developer
 * via the publish portal — can be an http(s) URL, blob: URL, or data: URL).
 */
export function getTrailer(gameId: string, custom?: string): string {
  if (custom) return custom;
  const path = gameTrailers[gameId] ?? defaultTrailer;
  // Clean up double slashes if any
  return path.replace(/\/+/g, "/");
}

