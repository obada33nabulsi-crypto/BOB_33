// All games share the same uploaded launch trailer.
const SHARED_TRAILER = "/videos/trailer_ac_mirage.mp4";

export const gameTrailers: Record<string, string> = {
  "cyber-odyssey": "/videos/trailer_ac_mirage.mp4",
  "shadow-realm": "/videos/trailer_ac_mirage.mp4",
  "nova-protocol": "/videos/trailer_ac_mirage.mp4",
  "iron-dynasty": "/videos/trailer_ac_mirage.mp4",
  "void-hunters": "/videos/trailer_ac_mirage.mp4",
  "eternal-fortress": "/videos/trailer_ac_mirage.mp4",
};

export const defaultTrailer = SHARED_TRAILER;

/**
 * Resolve the trailer source for a given game id.
 * Accepts an optional custom URL (e.g. uploaded by an indie developer
 * via the publish portal — can be an http(s) URL, blob: URL, or data: URL).
 */
export function getTrailer(gameId: string, custom?: string): string {
  if (custom) return custom;
  return gameTrailers[gameId] ?? defaultTrailer;
}
