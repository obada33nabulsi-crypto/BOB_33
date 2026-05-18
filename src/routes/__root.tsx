import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ShopProvider } from "@/store/shop";
import { UIProvider } from "@/store/ui";
import { AuthProvider } from "@/store/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FriendsDrawer from "@/components/FriendsDrawer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import NexusAI from "@/components/NexusAI";

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
            to="/register"
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
      { property: "og:title", content: "Umbrella — Premium Game Store" },
      { name: "twitter:title", content: "Umbrella — Premium Game Store" },
      { property: "og:description", content: "Discover, collect, and play the next generation of games." },
      { name: "twitter:description", content: "Discover, collect, and play the next generation of games." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/22caee8a-7373-45a6-920f-9879b867971b/id-preview-ec20eba7--30540425-2ca2-4b19-a95a-eddb3498c9dd.lovable.app-1776714009722.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/22caee8a-7373-45a6-920f-9879b867971b/id-preview-ec20eba7--30540425-2ca2-4b19-a95a-eddb3498c9dd.lovable.app-1776714009722.png" },
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
  const location = useLocation();
  const isIndex = location.pathname === '/';

  return (
    <AuthProvider>
      <ShopProvider>
        <UIProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {!isIndex && <Navbar />}
            <main className="flex-1">
              <Outlet />
            </main>
            {!isIndex && <Footer />}
            <FriendsDrawer />
            <CartDrawer />
            <CheckoutModal />
            <NexusAI />
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
    </AuthProvider>
  );
}