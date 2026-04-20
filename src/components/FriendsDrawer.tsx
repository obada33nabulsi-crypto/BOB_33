import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { toast } from "sonner";
import { useUI } from "@/store/ui";
import { FRIENDS } from "@/lib/friends";

type Tab = "online" | "all" | "pending";

function Avatar({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center font-display text-xs text-white border-2 border-[#1a1a1a] shrink-0"
      style={{ background: color, width: size, height: size, boxShadow: "2px 2px 0 0 #1a1a1a" }}
    >
      {initials}
    </div>
  );
}

export default function FriendsDrawer() {
  const { friendsOpen, setFriendsOpen } = useUI();
  const [tab, setTab] = useState<Tab>("online");
  const [q, setQ] = useState("");

  const online = FRIENDS.filter((f) => f.status === "online");
  const all = FRIENDS.filter((f) => f.status !== "pending-in");
  const pending = FRIENDS.filter((f) => f.status === "pending-in");

  const filter = (list: typeof FRIENDS) =>
    list.filter((f) => f.username.toLowerCase().includes(q.toLowerCase()));

  return (
    <AnimatePresence>
      {friendsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFriendsOpen(false)}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-card border-l-2 border-primary z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <h2 className="font-display text-base text-primary">FRIENDS</h2>
              <button
                onClick={() => setFriendsOpen(false)}
                className="p-2 hover:bg-primary/10 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b-2 border-border">
              <div className="flex items-center gap-2 bg-input border-2 border-border px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="SEARCH FRIENDS..."
                  className="w-full bg-transparent font-heading text-lg outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex border-b-2 border-border">
              {([
                ["online", `Online (${online.length})`],
                ["all", `All (${all.length})`],
                ["pending", `Pending (${pending.length})`],
              ] as [Tab, string][]).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`flex-1 py-3 font-display text-[10px] tracking-wider transition ${
                    tab === k
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {tab === "online" &&
                filter(online).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 bg-background border-2 border-border p-3"
                    style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                  >
                    <div className="relative">
                      <Avatar initials={f.initials} color={f.color} />
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[var(--brand-green-1)] border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-xl leading-none">{f.username}</div>
                      <div className="text-xs text-[var(--brand-green-1)] mt-1 truncate">
                        ▶ {f.game}
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Invite sent to ${f.username}`)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground font-display text-[9px] tracking-wider hover:translate-x-[-1px] hover:translate-y-[-1px] transition"
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    >
                      INVITE
                    </button>
                  </div>
                ))}

              {tab === "all" &&
                filter(all).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 bg-background border-2 border-border p-3"
                    style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                  >
                    <div className="relative">
                      <Avatar initials={f.initials} color={f.color} />
                      {f.status === "online" && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[var(--brand-green-1)] border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-xl leading-none">{f.username}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {f.status === "online" ? `Playing ${f.game}` : f.lastOnline}
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Message sent to ${f.username}`)}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground font-display text-[9px] tracking-wider"
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                    >
                      MESSAGE
                    </button>
                  </div>
                ))}

              {tab === "pending" &&
                filter(pending).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 bg-background border-2 border-border p-3"
                    style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                  >
                    <Avatar initials={f.initials} color={f.color} />
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-xl leading-none">{f.username}</div>
                      <div className="text-xs text-muted-foreground mt-1">Wants to be friends</div>
                    </div>
                    <button
                      onClick={() => toast.success(`Accepted ${f.username}`)}
                      className="p-2 bg-[var(--brand-green-1)] text-[var(--gray-deep)]"
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                      aria-label="Accept"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toast(`Declined ${f.username}`)}
                      className="p-2 bg-muted text-foreground"
                      style={{ boxShadow: "2px 2px 0 0 #1a1a1a" }}
                      aria-label="Decline"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
