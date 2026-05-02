import heroCyber from "@/assets/heading-image/crimson-desert-game-3840x2160-25363.jpg";
import gameShadow from "@/assets/heading-image/gv8967bk4ksd1.jpeg";
import gameNova from "@/assets/heading-image/marvels-spider-man-3840x2160-11609.jpeg";
import gameIron from "@/assets/heading-image/thumb-1920-917971.jpg";
import gameVoid from "@/assets/heading-image/wallpaperflare.com_wallpaper.jpg";
import gameEternal from "@/assets/heading-image/wallpaperflare.com_wallpaper2.jpg";
import gameOdyssey from "@/assets/heading-image/wp1980789-tom-clancys-rainbow-six-siege-wallpapers.jpg";

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
    id: "crimson-Desert",
    title: "Crimson Desert",
    cover: heroCyber,
    genres: ["Strategy", "Fantasy"],
    price: 44.99,
    discount: 25,
    rating: 4.9,
    description: "Defend the last sky-bound bastion against the storm legions.",
  },
  {
    id: "cyber-odyssey",
    title: "Rainbow Six Siege",
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
    title: "silent hill 2",
    cover: gameShadow,
    genres: ["RPG", "Dark Fantasy"],
    price: 49.99,
    discount: 35,
    rating: 4.6,
    description: "Wield forbidden magic in a cathedral of forgotten gods.",
  },
  {
    id: "nova-protocol",
    title: "spider-man 2",
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
    title: "red dead redemption 2",
    cover: gameIron,
    genres: ["Action", "Strategy"],
    price: 54.99,
    rating: 4.7,
    description: "Forge an empire of steam and steel in feudal Japan.",
  },
  {
    id: "void-hunters",
    title: "Assassin's Creed Mirage",
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
    title: "the witcher 3",
    cover: gameEternal,
    genres: ["Strategy", "Fantasy"],
    price: 44.99,
    discount: 25,
    rating: 4.9,
    description: "Defend the last sky-bound bastion against the storm legions.",
  },
];



export function priceAfterDiscount(g: Game) {
  if (!g.discount) return g.price;
  return +(g.price * (1 - g.discount / 100)).toFixed(2);
}
