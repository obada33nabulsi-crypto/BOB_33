export const gameTrailers: Record<string, string> = {
  "cyber-odyssey": "https://www.youtube.com/embed/8X2kIfS6fb8",
  "shadow-realm": "https://www.youtube.com/embed/hhBpVAkCCOE",
  "nova-protocol": "https://www.youtube.com/embed/2EwViQxSJJQ",
  "iron-dynasty": "https://www.youtube.com/embed/7AMd0_Dqut4",
  "void-hunters": "https://www.youtube.com/embed/RkC0l4iekYo",
  "eternal-fortress": "https://www.youtube.com/embed/FqnKB22pOC0",
};

const FALLBACK = "https://www.youtube.com/embed/dQw4w9WgXcQ";

/** Convert any YouTube/Vimeo URL to an embeddable form. */
export function toEmbedUrl(raw: string): string {
  if (!raw) return FALLBACK;
  try {
    const u = new URL(raw);
    // YouTube watch?v=ID
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    // vimeo.com/ID
    if (u.hostname.includes("vimeo.com") && !u.hostname.includes("player.")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    // Already embed
    return raw;
  } catch {
    return FALLBACK;
  }
}

export function getTrailer(gameId: string, custom?: string): string {
  if (custom) return toEmbedUrl(custom);
  return gameTrailers[gameId] ?? FALLBACK;
}

export function withAutoplay(embedUrl: string): string {
  const sep = embedUrl.includes("?") ? "&" : "?";
  return `${embedUrl}${sep}autoplay=1&rel=0&modestbranding=1`;
}
