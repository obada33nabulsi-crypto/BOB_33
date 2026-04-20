export type Friend = {
  id: string;
  username: string;
  initials: string;
  color: string;
  status: "online" | "offline" | "pending-in";
  game?: string;
  lastOnline?: string;
};

export const FRIENDS: Friend[] = [
  { id: "f1", username: "NeonSamurai", initials: "NS", color: "#ea34a9", status: "online", game: "Cyber Odyssey" },
  { id: "f2", username: "VoidHunter88", initials: "VH", color: "#7e5ecc", status: "online", game: "Void Hunters" },
  { id: "f3", username: "PixelQueen", initials: "PQ", color: "#64ff00", status: "online", game: "Shadow Realm" },
  { id: "f4", username: "IronFist", initials: "IF", color: "#df158c", status: "offline", lastOnline: "2 hours ago" },
  { id: "f5", username: "NovaPilot", initials: "NP", color: "#aa4faf", status: "offline", lastOnline: "Yesterday" },
  { id: "f6", username: "EternalKnight", initials: "EK", color: "#d97ee0", status: "offline", lastOnline: "3 days ago" },
  { id: "f7", username: "GlitchWitch", initials: "GW", color: "#a88fe5", status: "offline", lastOnline: "1 week ago" },
  { id: "f8", username: "ArcadeGhost", initials: "AG", color: "#98ff55", status: "offline", lastOnline: "5 hours ago" },
  { id: "f9", username: "SynthRider", initials: "SR", color: "#f453bb", status: "offline", lastOnline: "30 min ago" },
  { id: "f10", username: "ByteBrawler", initials: "BB", color: "#ea34a9", status: "offline", lastOnline: "1 hour ago" },
  { id: "f11", username: "QuantumLeap", initials: "QL", color: "#7e5ecc", status: "offline", lastOnline: "Yesterday" },
  { id: "f12", username: "RetroMage", initials: "RM", color: "#64ff00", status: "offline", lastOnline: "4 days ago" },
  { id: "p1", username: "ShadowRogue", initials: "SR", color: "#df158c", status: "pending-in" },
  { id: "p2", username: "CrimsonFox", initials: "CF", color: "#f453bb", status: "pending-in" },
];

export type Review = {
  id: string;
  username: string;
  initials: string;
  color: string;
  rating: number;
  date: string;
  text: string;
};

export const SAMPLE_REVIEWS: Review[] = [
  { id: "r1", username: "PixelKnight", initials: "PK", color: "#ea34a9", rating: 5, date: "2 days ago", text: "Absolutely mind-blowing. The world design is unmatched and the soundtrack hits hard from the very first scene." },
  { id: "r2", username: "RetroSoul", initials: "RS", color: "#7e5ecc", rating: 4, date: "1 week ago", text: "Fantastic experience overall, with a few rough edges that don't take away from the brilliance." },
  { id: "r3", username: "NeonDrift", initials: "ND", color: "#64ff00", rating: 5, date: "2 weeks ago", text: "I lost two weekends to this. Worth every cent. Combat is buttery and exploration never gets old." },
  { id: "r4", username: "VoxelVixen", initials: "VV", color: "#df158c", rating: 4, date: "3 weeks ago", text: "Great writing, memorable characters, and gorgeous lighting. Some side quests feel padded." },
  { id: "r5", username: "ChromaWolf", initials: "CW", color: "#a88fe5", rating: 5, date: "1 month ago", text: "The studio has outdone themselves. A genre-defining release I'll be returning to for years." },
];
