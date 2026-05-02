// All games share the same uploaded launch trailer for now.
const SHARED_TRAILER = "/trailers/launch.mp4";

export const gameTrailers: Record<string, string> = {
  "cyber-odyssey": SHARED_TRAILER,
  "shadow-realm": SHARED_TRAILER,
  "nova-protocol": SHARED_TRAILER,
  "iron-dynasty": SHARED_TRAILER,
  "void-hunters": SHARED_TRAILER,
  "eternal-fortress": SHARED_TRAILER,
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
