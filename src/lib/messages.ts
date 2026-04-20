import { FRIENDS, type Friend } from "./friends";

export type Message = {
  id: string;
  senderId: string; // "me" or friend id
  text: string;
  timestamp: number;
  seen?: boolean;
};

export type Conversation = {
  friendId: string;
  messages: Message[];
};

const now = Date.now();
const min = 60_000;
const hr = 3_600_000;

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    friendId: "f1",
    messages: [
      { id: "m1", senderId: "f1", text: "Yo you online? Wanna raid tonight?", timestamp: now - 2 * hr, seen: true },
      { id: "m2", senderId: "me", text: "Hell yeah! Let me finish this quest first", timestamp: now - 1.5 * hr, seen: true },
      { id: "m3", senderId: "f1", text: "Sweet, I'll gear up. Meet at the guild hall 🏰", timestamp: now - 1 * hr, seen: true },
      { id: "m4", senderId: "me", text: "On my way! Got some new loot to show you", timestamp: now - 30 * min, seen: true },
      { id: "m5", senderId: "f1", text: "Nice! Can't wait to see it 🔥", timestamp: now - 15 * min },
    ],
  },
  {
    friendId: "f2",
    messages: [
      { id: "m6", senderId: "me", text: "Have you tried Void Hunters yet?", timestamp: now - 5 * hr, seen: true },
      { id: "m7", senderId: "f2", text: "Playing it right now! It's terrifying 😱", timestamp: now - 4 * hr, seen: true },
      { id: "m8", senderId: "f2", text: "The deep abyss level is insane", timestamp: now - 3 * hr },
    ],
  },
  {
    friendId: "f3",
    messages: [
      { id: "m9", senderId: "f3", text: "Check out this build I made in Shadow Realm", timestamp: now - 24 * hr, seen: true },
      { id: "m10", senderId: "me", text: "That's sick! What spells are you using?", timestamp: now - 23 * hr, seen: true },
      { id: "m11", senderId: "f3", text: "Void magic + fire combo. Absolutely broken lol", timestamp: now - 22 * hr, seen: true },
    ],
  },
  {
    friendId: "f4",
    messages: [
      { id: "m12", senderId: "f4", text: "GG last night, that was fun", timestamp: now - 48 * hr, seen: true },
      { id: "m13", senderId: "me", text: "For sure! We should squad up again soon", timestamp: now - 47 * hr, seen: true },
    ],
  },
];

export function getFriend(id: string): Friend | undefined {
  return FRIENDS.find((f) => f.id === id);
}

export function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "now";
  if (diff < hr) return `${Math.floor(diff / min)}m ago`;
  if (diff < 24 * hr) return `${Math.floor(diff / hr)}h ago`;
  return `${Math.floor(diff / (24 * hr))}d ago`;
}
