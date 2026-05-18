import { Twitter, Github, Twitch, Youtube, Upload } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/logo-umbrella.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);

  return (
    <footer className="relative border-t-2 border-primary flex justify-center items-center flex-col w-full">
      <div className="mt-[50px] absolute top-[-5%] left-[8%]">
        <img src={logoUrl} alt="Umbrella" className="pixel-img h-[50px] w-[200px]" />
      </div>
      <div className="container flex justify-center gap-20 py-[100px] w-[105%]">
        {[
          { title: "STORE", links: ["Browse", "New Releases", "Top Sellers", "Free Games"] },
          { title: "COMMUNITY", links: ["Forums", "Reviews", "Events", "Creators"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-xl tracking-widest text-primary mb-4">{col.title}</h4>
            <ul className="space-y-2 font-heading text-xl text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="w-[320px] pl-4">
          <h4 className="font-display text-xl tracking-widest text-primary mb-4">DEVELOPERS</h4>
          <ul className="space-y-2 font-heading text-xl text-muted-foreground">
            <li>
              <Link to="/developer/publish" className="relative inline-flex items-center gap-1 hover:text-primary transition">
                <Upload className="h-3 w-3" /> Publish Your Game
              </Link>
            </li>
            <li>
              <Link to="/developer/dashboard" className="hover:text-primary transition">
                Developer Dashboard
              </Link>
            </li>
            <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
            <li><a href="#" className="hover:text-primary transition">Revenue Share</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl tracking-widest text-primary mb-4">NEWSLETTER</h4>
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
