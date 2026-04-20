import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Send, Sparkles } from "lucide-react";
import nexusAvatar from "@/assets/nexus-ai-avatar.png";
import { GAMES } from "@/lib/games";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME = "Hey gamer! 👾 I'm NexusAI. Ask me anything about games, recommendations, or the store!";

const CHIPS = [
  "🎮 Recommend a game",
  "🔥 Best deals today",
  "❓ Help me choose",
  "📋 My wishlist",
];

// Simple local responses — no API needed
function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("recommend") || lower.includes("suggest")) {
    const picks = GAMES.sort(() => Math.random() - 0.5).slice(0, 3);
    return `Great taste! Here are 3 picks for you: 🎮\n\n${picks.map((g) => `**${g.title}** — ${g.description} (${g.genres.join(", ")}) — $${g.price}`).join("\n\n")}\n\nWant more details on any of these?`;
  }

  if (lower.includes("deal") || lower.includes("sale") || lower.includes("discount")) {
    const deals = GAMES.filter((g) => g.discount).sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (deals.length === 0) return "No deals right now, but check back soon! 🔥";
    return `🔥 Today's hottest deals:\n\n${deals.map((g) => `**${g.title}** — ${g.discount}% OFF! Now $${(g.price * (1 - (g.discount || 0) / 100)).toFixed(2)}`).join("\n\n")}\n\nGrab them before they're gone! ⏰`;
  }

  if (lower.includes("help") || lower.includes("choose")) {
    return "I'd love to help! 🤔 What genres do you enjoy?\n\n• **Action** — Fast-paced combat & adrenaline\n• **RPG** — Deep stories & character building\n• **Strategy** — Tactical thinking & resource management\n• **Indie** — Unique & creative experiences\n• **Horror** — Spooky & atmospheric thrills\n\nTell me your vibe and I'll find the perfect game! 🎯";
  }

  if (lower.includes("wishlist")) {
    return "Check your wishlist by clicking the ❤️ icon in the navbar! You can also hit the heart on any game card to save it for later. Pro tip: enable sale notifications so you never miss a deal! 🔔";
  }

  if (lower.includes("action")) {
    const action = GAMES.filter((g) => g.genres.includes("Action"));
    return `⚔️ Action games in the store:\n\n${action.map((g) => `**${g.title}** — ${g.description}`).join("\n\n")}\n\nWant me to add any to your cart? 🛒`;
  }

  if (lower.includes("rpg")) {
    const rpgs = GAMES.filter((g) => g.genres.includes("RPG"));
    return `🛡️ RPG adventures await:\n\n${rpgs.map((g) => `**${g.title}** — ${g.description}`).join("\n\n")}\n\nThese are some of our best sellers!`;
  }

  const responses = [
    "That's a great question! 🤓 Our store has amazing titles across all genres. Want me to recommend something specific?",
    "I'm here to help! 🎮 Try asking me about deals, game recommendations, or specific genres!",
    "Cool! 😎 Let me know if you want game suggestions, deal alerts, or help navigating the store!",
    "Interesting! 🕹️ I know a lot about the games in our store. Ask me about any genre or specific title!",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function NexusAI() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  function send(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateResponse(msg);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 800 + Math.random() * 800);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className={`fixed bottom-6 right-6 z-[80] h-16 w-16 overflow-hidden border-2 border-secondary flex items-center justify-center transition-transform hover:scale-110 ${open ? "hidden" : ""}`}
        style={{ boxShadow: "0 0 20px rgba(126,94,204,0.4), 4px 4px 0 0 #1a1a1a" }}
        animate={{ boxShadow: [
          "0 0 20px rgba(126,94,204,0.4), 4px 4px 0 0 #1a1a1a",
          "0 0 30px rgba(126,94,204,0.7), 4px 4px 0 0 #1a1a1a",
          "0 0 20px rgba(126,94,204,0.4), 4px 4px 0 0 #1a1a1a",
        ] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        title="Chat with NexusAI"
      >
        <img src={nexusAvatar} alt="NexusAI" className="h-full w-full object-cover pixel-img" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[80] w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col bg-card border-2 border-secondary overflow-hidden"
            style={{ boxShadow: "0 0 30px rgba(126,94,204,0.3), 6px 6px 0 0 #1a1a1a" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-3 shrink-0"
              style={{ background: "linear-gradient(135deg, #7e5ecc, #ea34a9)" }}
            >
              <img src={nexusAvatar} alt="" className="h-10 w-10 pixel-img border-2 border-white/30" />
              <div className="flex-1">
                <div className="font-display text-[10px] text-white">NEXUS AI</div>
                <div className="text-xs text-white/70 font-heading">Your Gaming Assistant</div>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="p-1.5 text-white/70 hover:text-white transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-white/70 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start gap-2"}`}>
                  {m.role === "assistant" && (
                    <img src={nexusAvatar} alt="" className="h-7 w-7 pixel-img border border-secondary shrink-0 mt-1" />
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm font-body leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "glass"
                    }`}
                    style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                  >
                    {m.content.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-1" : ""}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={k} className="text-primary font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <img src={nexusAvatar} alt="" className="h-7 w-7 pixel-img border border-secondary shrink-0 mt-1" />
                  <div className="glass px-4 py-3 flex items-center gap-1.5" style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 bg-secondary rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick chips */}
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="px-2 py-1 text-[10px] font-display border border-secondary text-secondary-foreground hover:bg-secondary/20 transition truncate"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t-2 border-border flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask NexusAI..."
                className="flex-1 bg-input border-2 border-border px-3 py-2 text-sm font-body outline-none placeholder:text-muted-foreground focus:border-secondary transition"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="p-2.5 bg-secondary text-white disabled:opacity-40 hover:brightness-110 transition"
                style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized state */}
      {open && minimized && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 px-4 py-2 bg-card border-2 border-secondary hover:scale-105 transition"
          style={{ boxShadow: "0 0 20px rgba(126,94,204,0.3), 4px 4px 0 0 #1a1a1a" }}
        >
          <img src={nexusAvatar} alt="" className="h-8 w-8 pixel-img" />
          <span className="font-display text-[9px] text-secondary">NEXUS AI</span>
          <Sparkles className="h-4 w-4 text-secondary" />
        </motion.button>
      )}
    </>
  );
}
