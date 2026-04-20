import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ShopProvider } from "@/store/shop";
import { UIProvider } from "@/store/ui";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FriendsDrawer from "@/components/FriendsDrawer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-gradient-pink">404</h1>
        <h2 className="mt-4 font-display text-base">PAGE NOT FOUND</h2>
        <p className="mt-2 font-heading text-xl text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink"
          >
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Umbrella — Premium Game Store" },
      { name: "description", content: "Discover, collect, and play the next generation of games." },
      { name: "author", content: "Umbrella" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ShopProvider>
      <UIProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <FriendsDrawer />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#2a2a2a",
                border: "2px solid #ea34a9",
                color: "#e5e5e5",
                fontFamily: "'VT323', monospace",
                fontSize: "1.125rem",
                borderRadius: 0,
                boxShadow: "4px 4px 0 0 #1a1a1a",
              },
            }}
          />
        </div>
      </UIProvider>
    </ShopProvider>
  );
}
