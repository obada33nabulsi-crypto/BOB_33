import { Twitter, Github, Twitch, Youtube } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);

  return (
    <footer className="mt-16 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-md bg-[var(--gradient-neon)] glow-cyan" />
            <span className="font-display text-2xl tracking-widest text-gradient-neon">UMBRELLA</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The premium destination for next-gen gaming. Powered by players, built for legends.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Github, Twitch, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-md glass flex items-center justify-center hover:border-primary/50 hover:text-primary transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Store", links: ["Browse", "New Releases", "Top Sellers", "Free Games"] },
          { title: "Community", links: ["Forums", "Reviews", "Events", "Creators"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">Get drop alerts and exclusive deals.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSub(true); }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@umbrella.gg"
              className="flex-1 px-3 py-2 rounded-md bg-input/60 border border-border text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="px-4 py-2 rounded-md bg-[var(--gradient-neon)] text-primary-foreground text-sm font-heading font-bold uppercase tracking-wider glow-cyan">
              Join
            </button>
          </form>
          {sub && <p className="text-xs text-primary mt-2">✓ Welcome to the squad.</p>}
          <div className="flex gap-2 mt-6">
            <div className="px-2 py-1 rounded glass text-[10px] font-heading uppercase tracking-wider">Win · Mac · Linux</div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Umbrella Interactive. All rights reserved.
      </div>
    </footer>
  );
}
