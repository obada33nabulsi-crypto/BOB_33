import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CatalogGrid from "@/components/CatalogGrid";
import CategoriesSection from "@/components/CategoriesSection";
import SpecialOffer from "@/components/SpecialOffer";
import NewReleases from "@/components/NewReleases";
import { AuthProvider } from "@/store/auth";
import { ShopProvider } from "@/store/shop";
import { UIProvider } from "@/store/ui";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import FriendsDrawer from "@/components/FriendsDrawer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import NexusAI from "@/components/NexusAI";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Umbrella — Premium Game Store" },
      { name: "description", content: "Discover, collect, and play the next generation of AAA and indie games. Cinematic deals, daily drops, and exclusive releases." },
      { property: "og:title", content: "Umbrella — Premium Game Store" },
      { property: "og:description", content: "The cinematic destination for next-gen gaming." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
        <Hero />
        <FeaturedCarousel />
        <CatalogGrid />
        <CategoriesSection />
        <SpecialOffer />
        <NewReleases />
    </>
  );
}


function RootComponent() {
  return (
    <AuthProvider>
      <ShopProvider>
        <UIProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
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
