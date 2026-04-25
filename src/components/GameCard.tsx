import { Star, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { useShop } from "@/store/shop";
import { useUI } from "@/store/ui";
import { priceAfterDiscount, type Game } from "@/lib/games";
import TrailerModal from "@/components/TrailerModal";
import cartIcon from "@/assets/icon-cart.png";
import heartIcon from "@/assets/icon-heart.png";

export default function GameCard({ game }: { game: Game }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { bumpCart } = useUI();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const isWished = wishlist.includes(game.id);
  const finalPrice = priceAfterDiscount(game);

  return (
    <motion.div
      whileHover={{ y: -6, x: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden bg-card border-2 border-border hover:border-primary transition-all duration-200"
      style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
    >
      <Link to="/game/$id" params={{ id: game.id }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={game.cover}
            alt={game.title}
            loading="lazy"
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {game.discount && (
              <div className="px-2 py-1 bg-[var(--brand-green-1)] text-[var(--gray-deep)] font-display text-[10px] tracking-wider">
                -{game.discount}%
              </div>
            )}
            {game.isNew && (
              <div className="px-2 py-1 bg-primary text-primary-foreground font-display text-[10px] tracking-wider">
                NEW
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(game.id);
              toast(isWished ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="absolute top-3 right-3 h-10 w-10 bg-card border-2 border-border flex items-center justify-center hover:scale-110 transition"
            aria-label="Toggle wishlist"
          >
            <img src={heartIcon} alt="" className={`pixel-img h-5 w-5 transition ${isWished ? "opacity-100" : "opacity-40 grayscale"}`} />
          </button>

          {/* Hover trailer play */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTrailerOpen(true);
            }}
            title="Watch Trailer"
            aria-label="Watch trailer"
            className="absolute top-3 right-16 h-10 w-10 bg-card/80 border-2 border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-primary hover:scale-110 transition"
          >
            <Play className="h-4 w-4 fill-primary text-primary" />
          </button>

          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-background via-background/80 to-transparent">
            <p className="font-heading text-lg text-foreground/90 mb-3 line-clamp-2 leading-tight">{game.description}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const added = addToCart(game.id);
                if (added) { bumpCart(); toast.success(`${game.title} added to cart!`); }
                else toast("Already in your cart!");
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
            >
              <img src={cartIcon} alt="" className="pixel-img h-4 w-4" /> QUICK ADD
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-2xl leading-none line-clamp-1">{game.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 fill-[var(--brand-green-1)] text-[var(--brand-green-1)]" />
              <span className="font-heading text-lg text-foreground/80">{game.rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {game.genres.map((g) => (
              <span key={g} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-secondary text-secondary-foreground font-display">
                {g}
              </span>
            ))}
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            {game.discount ? (
              <>
                <span className="font-heading text-lg text-muted-foreground line-through">${game.price}</span>
                <span className="font-display text-lg text-primary">${finalPrice}</span>
              </>
            ) : (
              <span className="font-display text-lg">${game.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
