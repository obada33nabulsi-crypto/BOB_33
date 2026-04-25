import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { getTrailer, withAutoplay } from "@/lib/trailers";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
  customUrl?: string;
}

export default function TrailerModal({ open, onClose, gameId, customUrl }: TrailerModalProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const src = open ? withAutoplay(getTrailer(gameId, customUrl)) : "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-0 sm:p-4"
        >
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="fixed top-4 right-4 z-10 p-2 rounded-full bg-card/80 border-2 border-border hover:border-primary text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-[1100px] aspect-video bg-black"
          >
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#00f5ff" }} />
              </div>
            )}
            <iframe
              key={src}
              src={src}
              title="Game trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              className="h-full w-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
