export const gameTrailers: Record<string, string> = {
  "cyber-odyssey":
    "https://cdn.pixabay.com/video/2022/10/13/134942-761451830_large.mp4",
  "shadow-realm":
    "https://cdn.pixabay.com/video/2023/03/15/155428-808849752_large.mp4",
  "nova-protocol":
    "https://cdn.pixabay.com/video/2022/11/04/137675-769156497_large.mp4",
  "iron-dynasty":
    "https://cdn.pixabay.com/video/2021/09/14/88646-607799775_large.mp4",
  "void-hunters":
    "https://cdn.pixabay.com/video/2023/01/20/147973-791347113_large.mp4",
  "eternal-fortress":
    "https://cdn.pixabay.com/video/2022/08/04/127020-734100008_large.mp4",
};

export const defaultTrailer =
  "https://cdn.pixabay.com/video/2023/06/01/165646-832898452_large.mp4";

/**
 * Resolve the trailer source for a given game id.
 * Accepts an optional custom URL (e.g. uploaded by an indie developer
 * via the publish portal — can be an http(s) URL, blob: URL, or data: URL).
 */
export function getTrailer(gameId: string, custom?: string): string {
  if (custom) return custom;
  return gameTrailers[gameId] ?? defaultTrailer;
}
