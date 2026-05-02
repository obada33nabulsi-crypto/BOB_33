import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, ArrowLeft, Smile, Image, CheckCheck } from "lucide-react";
import { MOCK_CONVERSATIONS, getFriend, formatTime, type Message, type Conversation } from "@/lib/messages";
import { useRequireAuth } from "@/hooks/use-require-auth";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Umbrella" },
      { name: "description", content: "Chat with your gaming friends." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  useRequireAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const active = conversations.find((c) => c.friendId === activeId);
  const activeFriend = activeId ? getFriend(activeId) : null;

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const f = getFriend(c.friendId);
      return f?.username.toLowerCase().includes(search.toLowerCase());
    });
  }, [conversations, search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  function sendMessage() {
    if (!input.trim() || !activeId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: input.trim(),
      timestamp: Date.now(),
      seen: false,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.friendId === activeId ? { ...c, messages: [...c.messages, msg] } : c
      )
    );
    setInput("");
    inputRef.current?.focus();

    // Simulate friend typing + reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = [
        "Haha nice! 😄", "Let's gooo! 🔥", "That's awesome!", "No way! 😮",
        "Sounds like a plan 👍", "GG! 🎮", "I'm down for that!",
      ];
      const reply: Message = {
        id: `m-${Date.now() + 1}`,
        senderId: activeId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.friendId === activeId ? { ...c, messages: [...c.messages, reply] } : c
        )
      );
    }, 1500 + Math.random() * 1000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const lastMsg = (c: Conversation) => c.messages[c.messages.length - 1];
  const unread = (c: Conversation) =>
    c.messages.filter((m) => m.senderId !== "me" && !m.seen).length;

  return (
    <div className="container mx-auto flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)]">
      {/* Sidebar - conversations list */}
      <div
        className={`${activeId ? "hidden md:flex" : "flex"} w-full md:w-[340px] flex-col border-r-2 border-border bg-card shrink-0`}
      >
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display text-sm text-primary mb-3">MESSAGES</h2>
          <div className="flex items-center gap-2 bg-input border-2 border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH CONVERSATIONS..."
              className="w-full bg-transparent font-heading text-lg outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => {
            const friend = getFriend(c.friendId);
            if (!friend) return null;
            const last = lastMsg(c);
            const count = unread(c);
            return (
              <button
                key={c.friendId}
                onClick={() => setActiveId(c.friendId)}
                className={`w-full flex items-center gap-3 p-4 text-left transition hover:bg-primary/10 border-b border-border ${
                  activeId === c.friendId ? "bg-primary/15 border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className="h-11 w-11 flex items-center justify-center font-display text-xs text-white border-2 border-[#1a1a1a]"
                    style={{ background: friend.color, boxShadow: "2px 2px 0 0 #1a1a1a" }}
                  >
                    {friend.initials}
                  </div>
                  {friend.status === "online" && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[var(--brand-green-1)] border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl leading-none">{friend.username}</span>
                    <span className="text-[10px] text-muted-foreground font-heading">
                      {formatTime(last.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate mt-1">
                    {last.senderId === "me" ? "You: " : ""}
                    {last.text}
                  </div>
                </div>
                {count > 0 && (
                  <span className="h-5 min-w-5 bg-primary text-[10px] font-display text-white flex items-center justify-center px-1">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${activeId ? "flex" : "hidden md:flex"} flex-1 flex-col bg-background`}>
        {active && activeFriend ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b-2 border-border bg-card">
              <button
                onClick={() => setActiveId(null)}
                className="md:hidden p-2 hover:bg-primary/10 transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative">
                <div
                  className="h-10 w-10 flex items-center justify-center font-display text-xs text-white border-2 border-[#1a1a1a]"
                  style={{ background: activeFriend.color, boxShadow: "2px 2px 0 0 #1a1a1a" }}
                >
                  {activeFriend.initials}
                </div>
                {activeFriend.status === "online" && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[var(--brand-green-1)] border-2 border-card" />
                )}
              </div>
              <div>
                <div className="font-heading text-xl leading-none">{activeFriend.username}</div>
                <div className="text-xs text-[var(--brand-green-1)]">
                  {activeFriend.status === "online" ? `Playing ${activeFriend.game}` : activeFriend.lastOnline}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {active.messages.map((m) => {
                const isMe = m.senderId === "me";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 ${
                        isMe
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "glass"
                      }`}
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    >
                      <p className="font-heading text-lg leading-snug">{m.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                        <span className="text-[10px] opacity-60">{formatTime(m.timestamp)}</span>
                        {isMe && m.seen && <CheckCheck className="h-3 w-3 opacity-60" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="glass px-4 py-3 flex items-center gap-1.5" style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 bg-primary rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t-2 border-border bg-card">
              <div className="flex items-end gap-2">
                <button className="p-2 text-muted-foreground hover:text-primary transition">
                  <Smile className="h-5 w-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-primary transition">
                  <Image className="h-5 w-5" />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Send a message..."
                  rows={1}
                  className="flex-1 bg-input border-2 border-border px-3 py-2 font-heading text-lg outline-none resize-none placeholder:text-muted-foreground focus:border-primary transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-3 bg-primary text-white disabled:opacity-40 hover:brightness-110 transition"
                  style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-6xl">💬</div>
              <h3 className="font-display text-sm text-primary">SELECT A CONVERSATION</h3>
              <p className="font-heading text-xl text-muted-foreground">
                Choose a friend to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
