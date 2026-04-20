import { Twitter, Github, Twitch, Youtube } from "lucide-react";
import { useState } from "react";
import logoUrl from "@/assets/logo-umbrella.png";
import controllerIcon from "@/assets/icon-controller.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);

  return (
    <footer className="mt-16 border-t-2 border-primary">
      <div className="container mx-auto px-4 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={controllerIcon} alt="" className="pixel-img h-9 w-9" />
            <img src={logoUrl} alt="Umbrella" className="pixel-img h-8 w-auto" />
          </div>
          <p className="font-heading text-xl text-muted-foreground max-w-xs leading-tight">
            The premium pixel destination for next-gen gaming. Powered by players, built for legends.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Github, Twitch, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 bg-card border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "STORE", links: ["Browse", "New Releases", "Top Sellers", "Free Games"] },
          { title: "COMMUNITY", links: ["Forums", "Reviews", "Events", "Creators"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-xs tracking-widest text-primary mb-4">{col.title}</h4>
            <ul className="space-y-2 font-heading text-xl text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-display text-xs tracking-widest text-primary mb-4">NEWSLETTER</h4>
          <p className="font-heading text-xl text-muted-foreground mb-3 leading-tight">Get drop alerts and exclusive deals.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSub(true); }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@umbrella.gg"
              className="flex-1 px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink">
              JOIN
            </button>
          </form>
          {sub && <p className="font-heading text-lg text-[var(--brand-green-1)] mt-2">✓ WELCOME TO THE SQUAD</p>}
          <div className="flex gap-2 mt-6">
            <div className="px-2 py-1 bg-secondary text-secondary-foreground font-display text-[10px] tracking-wider">WIN · MAC · LINUX</div>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-border py-6 text-center font-display text-[10px] tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} UMBRELLA INTERACTIVE
      </div>
    </footer>
  );
}
