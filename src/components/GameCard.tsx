import { Heart, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useShop } from "@/store/shop";
import { priceAfterDiscount, type Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWished = wishlist.includes(game.id);
  const finalPrice = priceAfterDiscount(game);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-lg overflow-hidden glass hover:border-primary/50 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
    >
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {game.discount && (
            <div className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-heading font-bold tracking-wider glow-purple">
              -{game.discount}%
            </div>
          )}
          {game.isNew && (
            <div className="px-2 py-1 rounded bg-primary/90 text-primary-foreground text-xs font-heading font-bold tracking-wider">
              NEW
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(game.id); }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:scale-110 transition"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 transition ${isWished ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-background via-background/80 to-transparent">
          <p className="text-sm text-foreground/90 mb-3 line-clamp-2">{game.description}</p>
          <button
            onClick={() => addToCart(game.id)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--gradient-neon)] text-primary-foreground text-sm font-heading font-bold uppercase tracking-wider glow-cyan"
          >
            <Plus className="h-4 w-4" /> Quick Add
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-lg leading-tight line-clamp-1">{game.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-foreground/80">{game.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {game.genres.map((g) => (
            <span key={g} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-heading font-semibold">
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          {game.discount ? (
            <>
              <span className="text-xs text-muted-foreground line-through">${game.price}</span>
              <span className="font-heading font-bold text-lg text-primary">${finalPrice}</span>
            </>
          ) : (
            <span className="font-heading font-bold text-lg">${game.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
