import { createFileRoute } from "@tanstack/react-router";
import { ShopProvider } from "@/store/shop";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CatalogGrid from "@/components/CatalogGrid";
import CategoriesSection from "@/components/CategoriesSection";
import SpecialOffer from "@/components/SpecialOffer";
import NewReleases from "@/components/NewReleases";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
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
    <ShopProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <FeaturedCarousel />
          <CatalogGrid />
          <CategoriesSection />
          <SpecialOffer />
          <NewReleases />
        </main>
        <Footer />
      </div>
    </ShopProvider>
  );
}
