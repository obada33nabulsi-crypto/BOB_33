// Real screenshot URLs mapped per game ID. Falls back to gradient placeholders
// if a game has no entry (e.g. newly published indie titles).
import crimson from "@/assets/games/crimson/img (1).jpg";
import crimson2 from "@/assets/games/crimson/img (2).jpg";
import crimson3 from "@/assets/games/crimson/img (3).png";
import crimson4 from "@/assets/games/crimson/img (4).png";
import crimson5 from "@/assets/games/crimson/img (5).png";


import rinbowSixSage from "@/assets/games/rainbow-six-sage/img1 (1).jpg";
import rinbowSixSage2 from "@/assets/games/rainbow-six-sage/img1 (2).jpg";
import rinbowSixSage3 from "@/assets/games/rainbow-six-sage/img1 (3).jpg";
import rinbowSixSage4 from "@/assets/games/rainbow-six-sage/img1 (4).jpg";
import rinbowSixSage5 from "@/assets/games/rainbow-six-sage/img1 (5).jpg";
import rinbowSixSage6 from "@/assets/games/rainbow-six-sage/img1 (6).jpg";

import silentHill from "@/assets/games/Silent-hill/img (1).jpeg";
import silentHill2 from "@/assets/games/Silent-hill/img (1).jpg";
import silentHill3 from "@/assets/games/Silent-hill/img (2).jpg";
import silentHill4 from "@/assets/games/Silent-hill/img (3).jpg";
import silentHill5 from "@/assets/games/Silent-hill/img (4).jpg";
import silentHill6 from "@/assets/games/Silent-hill/img (5).jpg";

import spiderMan from "@/assets/games/spider-man/img (1).jpeg";
import spiderMan2 from "@/assets/games/spider-man/img (1).jpg";
import spiderMan3 from "@/assets/games/spider-man/img (2).jpeg";
import spiderMan4 from "@/assets/games/spider-man/img (2).jpg";
import spiderMan5 from "@/assets/games/spider-man/img (3).jpg";
import spiderMan6 from "@/assets/games/spider-man/img (4).jpg";

import redDead from "@/assets/games/red-dead/img (1).jpg";
import redDead2 from "@/assets/games/red-dead/img (1).png";
import redDead3 from "@/assets/games/red-dead/img (2).jpg";
import redDead4 from "@/assets/games/red-dead/img (2).png";
import redDead5 from "@/assets/games/red-dead/img (4).jpg";
import redDead6 from "@/assets/games/red-dead/img (5).jpg"; 

import assassin from "@/assets/games/Assassin-creed/img (1).jpg";
import assassin2 from "@/assets/games/Assassin-creed/img (2).jpg";
import assassin3 from "@/assets/games/Assassin-creed/img (3).jpg";
import assassin4 from "@/assets/games/Assassin-creed/img (4).jpg";
import assassin5 from "@/assets/games/Assassin-creed/img (5).jpg";
import assassin6 from "@/assets/games/Assassin-creed/img (6).jpg";

import theWicher from "@/assets/games/the-witcher/img (1).jpg";
import theWitcher2 from "@/assets/games/the-witcher/img (2).jpg";
import theWitcher3 from "@/assets/games/the-witcher/img (3).jpg";
import theWitcher4 from "@/assets/games/the-witcher/img (4).jpg";
import theWitcher5 from "@/assets/games/the-witcher/img (5).jpg";
import theWitcher6 from "@/assets/games/the-witcher/img (6).jpg";
import { th } from "date-fns/locale";
export const gameScreenshots: Record<string, string[]> = {
  
"crimson-Desert": [
    crimson,   
    crimson2,
    crimson3,
    crimson4,
    crimson5,
    "https://tse3.mm.bing.net/th/id/OIP.8vk8OsGDrxrrsj8RRcrTVQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  ],

  "cyber-odyssey": [
    rinbowSixSage,
    rinbowSixSage2,
    rinbowSixSage3,
    rinbowSixSage4,
    rinbowSixSage5,
    rinbowSixSage6,
  ],
  "shadow-realm": [
    silentHill,
    silentHill2,
    silentHill3,
    silentHill4,
    silentHill5,
    silentHill6,
  ],
  "nova-protocol": [
    spiderMan,
    spiderMan2,
    spiderMan3,
    spiderMan4,
    spiderMan5,
    spiderMan6,
  ],
  "iron-dynasty": [
    redDead,
    redDead2,
    redDead3,
    redDead4,
    redDead5,
    redDead6,
  ],
  "void-hunters": [
    assassin,
    assassin2,
    assassin3,
    assassin4,
    assassin5,
    assassin6,
  ],
  "eternal-fortress": [
    theWicher,
    theWitcher2,
    theWitcher3,
    theWitcher4,
    theWitcher5,
    theWitcher6,
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
