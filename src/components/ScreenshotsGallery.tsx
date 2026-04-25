import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getScreenshots, type Shot } from "@/lib/screenshots";

function ShotImage({
  shot,
  alt,
  className,
  loading = "lazy",
}: {
  shot: Shot;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [loaded, setLoaded] = useState(false);
  if (shot.gradient) {
    return (
      <div className={className} style={{ background: shot.gradient }}>
        <div className="absolute inset-0 scanlines opacity-30" />
      </div>
    );
  }
  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 animate-pulse bg-muted ${className ?? ""}`} />
      )}
      <img
        src={shot.url}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={`${className ?? ""} transition-[filter,opacity] duration-500 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
        style={{ filter: loaded ? "none" : "blur(12px)" }}
      />
    </>
  );
}

export default function ScreenshotsGallery({
  gameId,
  uploaded,
  title,
}: {
  gameId: string;
  uploaded?: string[];
  title: string;
}) {
  const shots = getScreenshots(gameId, uploaded);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const close = () => setLightbox(null);
  const next = () => setLightbox((i) => (i === null ? null : (i + 1) % shots.length));
  const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + shots.length) % shots.length));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, shots.length]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shots.map((shot, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group relative aspect-video border-2 border-border overflow-hidden hover:border-primary transition rounded-md"
            style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
          >
            <ShotImage
              shot={shot}
              alt={`${title} screenshot ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
            />
            <div className="absolute inset-0 flex items-center justify-center font-display text-xs text-white/90 opacity-0 group-hover:opacity-100 transition bg-background/30">
              VIEW {i + 1}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const dx = e.changedTouches[0].clientX - touchStart;
              if (dx > 50) prev();
              else if (dx < -50) next();
              setTouchStart(null);
            }}
            className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-4 right-4 p-2 bg-card border-2 border-border hover:border-primary z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute top-4 left-4 px-3 py-1 bg-card border-2 border-border font-display text-[10px] tracking-wider z-10">
              {lightbox + 1} / {shots.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card border-2 border-border hover:border-primary z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card border-2 border-border hover:border-primary z-10"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video border-2 border-primary overflow-hidden"
              style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
            >
              <ShotImage
                shot={shots[lightbox]}
                alt={`${title} screenshot ${lightbox + 1}`}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>

            <div className="mt-4 flex gap-2 overflow-x-auto max-w-full px-2" onClick={(e) => e.stopPropagation()}>
              {shots.map((shot, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`relative flex-shrink-0 w-24 aspect-video border-2 overflow-hidden transition ${
                    i === lightbox ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                  }`}
                >
                  <ShotImage
                    shot={shot}
                    alt={`Thumbnail ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
