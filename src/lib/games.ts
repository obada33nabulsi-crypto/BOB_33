import heroCyber from "@/assets/hero-cyber.jpg";
import gameShadow from "@/assets/game-shadow.jpg";
import gameNova from "@/assets/game-nova.jpg";
import gameIron from "@/assets/game-iron.jpg";
import gameVoid from "@/assets/game-void.jpg";
import gameEternal from "@/assets/game-eternal.jpg";
import gameOdyssey from "@/assets/game-odyssey.jpg";

export type Game = {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  price: number;
  discount?: number; // percent
  rating: number; // 0-5
  description: string;
  isNew?: boolean;
};

export const HERO_IMAGE = heroCyber;

export const GAMES: Game[] = [
  {
    id: "cyber-odyssey",
    title: "Cyber Odyssey",
    cover: gameOdyssey,
    genres: ["Action", "RPG"],
    price: 59.99,
    discount: 60,
    rating: 4.8,
    description: "A neon-soaked open world where every choice shapes the city.",
    isNew: true,
  },
  {
    id: "shadow-realm",
    title: "Shadow Realm",
    cover: gameShadow,
    genres: ["RPG", "Dark Fantasy"],
    price: 49.99,
    discount: 35,
    rating: 4.6,
    description: "Wield forbidden magic in a cathedral of forgotten gods.",
  },
  {
    id: "nova-protocol",
    title: "Nova Protocol",
    cover: gameNova,
    genres: ["Strategy", "Sci-Fi"],
    price: 39.99,
    discount: 50,
    rating: 4.4,
    description: "Command fleets across a fractured galaxy at war.",
    isNew: true,
  },
  {
    id: "iron-dynasty",
    title: "Iron Dynasty",
    cover: gameIron,
    genres: ["Action", "Strategy"],
    price: 54.99,
    rating: 4.7,
    description: "Forge an empire of steam and steel in feudal Japan.",
  },
  {
    id: "void-hunters",
    title: "Void Hunters",
    cover: gameVoid,
    genres: ["Indie", "Horror"],
    price: 24.99,
    discount: 40,
    rating: 4.5,
    description: "Hunt ancient terrors in the deep abyss between worlds.",
    isNew: true,
  },
  {
    id: "eternal-fortress",
    title: "Eternal Fortress",
    cover: gameEternal,
    genres: ["Strategy", "Fantasy"],
    price: 44.99,
    discount: 25,
    rating: 4.9,
    description: "Defend the last sky-bound bastion against the storm legions.",
  },
];

export const CATEGORIES = [
  { name: "Action", icon: "⚔️", count: 1284 },
  { name: "RPG", icon: "🛡️", count: 942 },
  { name: "Strategy", icon: "♟️", count: 567 },
  { name: "Indie", icon: "💎", count: 2103 },
  { name: "Free to Play", icon: "🎮", count: 318 },
];

export function priceAfterDiscount(g: Game) {
  if (!g.discount) return g.price;
  return +(g.price * (1 - g.discount / 100)).toFixed(2);
}
