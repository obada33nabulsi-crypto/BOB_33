import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RefreshCw,
} from "lucide-react";
import { getTrailer } from "@/lib/trailers";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
  customUrl?: string;
}

// Swapped from cyan to purple per design direction.
const CYAN = "#7c3aed"; // primary accent (now purple)
const PURPLE = "#a855f7"; // secondary accent (lighter purple)

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function TrailerModal({
  open,
  onClose,
  gameId,
  customUrl,
}: TrailerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const autoplayedRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const src = getTrailer(gameId, customUrl);

  const stopAndReset = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    stopAndReset();
    onClose();
  }, [onClose, stopAndReset]);

  // Lifecycle: lock scroll, ESC, reset state on open
  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setError(false);
    setCurrent(0);
    setDuration(0);
    setControlsVisible(true);
    autoplayedRef.current = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      stopAndReset();
    };
  }, [open, handleClose, stopAndReset]);

  // Autoplay only on the FIRST canplay event per load — subsequent canplay
  // events (from buffering) must NOT reset currentTime or re-trigger play(),
  // otherwise the browser aborts playback (looks like "plays 1s then pauses").
  const handleCanPlay = () => {
    setLoaded(true);
    if (autoplayedRef.current) return;
    autoplayedRef.current = true;
    const v = videoRef.current;
    if (!v) return;
    // Start muted — browsers reliably allow muted autoplay; user can unmute.
    v.muted = true;
    setMuted(true);
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // Even muted autoplay blocked — leave paused, user clicks play.
      });
    }
  };

  // Auto-hide controls
  const bumpControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!open) return;
    bumpControls();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [open, bumpControls]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    const v = videoRef.current;
    if (v) {
      v.volume = val;
      if (val === 0) {
        v.muted = true;
        setMuted(true);
      } else if (v.muted) {
        v.muted = false;
        setMuted(false);
      }
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const t = (Number(e.target.value) / 100) * duration;
    v.currentTime = t;
    setCurrent(t);
  };

  const enterFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen?.();
    }
  };

  const retry = () => {
    setError(false);
    setLoaded(false);
    setReloadKey((k) => k + 1);
  };

  const progressPct = duration > 0 ? (current / duration) * 100 : 0;
  const volumePct = (muted ? 0 : volume) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close trailer"
            className="fixed top-4 right-4 z-20 p-2 rounded-full bg-black/70 border-2 border-white/20 hover:border-[color:var(--cyan)] text-white transition"
            style={{ ["--cyan" as string]: CYAN }}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Video container */}
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={bumpControls}
            onTouchStart={bumpControls}
            className="relative w-full sm:max-w-[1100px] aspect-video bg-black overflow-hidden sm:rounded-[12px]"
            style={{
              boxShadow: `0 0 0 1px ${CYAN}55, 0 0 60px ${CYAN}33`,
            }}
          >
            {/* Loading spinner */}
            {!loaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <Loader2
                  className="h-12 w-12 animate-spin"
                  style={{ color: CYAN }}
                />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-10 text-white">
                <p className="text-lg font-semibold">Trailer unavailable</p>
                <button
                  onClick={retry}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border-2 transition hover:bg-white/10"
                  style={{ borderColor: CYAN, color: CYAN }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            )}

            {/* HTML5 video */}
            <video
              key={`${src}-${reloadKey}`}
              ref={videoRef}
              src={src}
              playsInline
              preload="metadata"
              onCanPlay={handleCanPlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) =>
                setCurrent((e.target as HTMLVideoElement).currentTime)
              }
              onLoadedMetadata={(e) =>
                setDuration((e.target as HTMLVideoElement).duration)
              }
              onError={() => {
                setError(true);
                setLoaded(false);
              }}
              onClick={togglePlay}
              className="h-full w-full"
              style={{ objectFit: "cover" }}
            >
              Your browser does not support the video tag.
            </video>

            {/* Custom controls bar */}
            <div
              className="absolute inset-x-0 bottom-0 px-3 sm:px-4 py-2 sm:py-3 transition-opacity duration-300"
              style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                opacity: controlsVisible || !playing ? 1 : 0,
                pointerEvents: controlsVisible || !playing ? "auto" : "none",
              }}
            >
              {/* Seek bar */}
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progressPct}
                onChange={onSeek}
                aria-label="Seek"
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer trailer-seek"
                style={{
                  background: `linear-gradient(to right, ${CYAN} 0%, ${CYAN} ${progressPct}%, rgba(255,255,255,0.2) ${progressPct}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />

              <div className="flex items-center gap-3 mt-2 text-white text-xs sm:text-sm">
                <button
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="p-1.5 sm:p-2 rounded hover:bg-white/10 transition"
                  style={{ color: CYAN }}
                >
                  {playing ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="p-1.5 sm:p-2 rounded hover:bg-white/10 transition"
                  style={{ color: CYAN }}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={onVolume}
                  aria-label="Volume"
                  className="hidden sm:block w-24 h-1.5 rounded-full appearance-none cursor-pointer trailer-volume"
                  style={{
                    background: `linear-gradient(to right, ${PURPLE} 0%, ${PURPLE} ${volumePct}%, rgba(255,255,255,0.2) ${volumePct}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />

                <span className="ml-1 tabular-nums text-white">
                  {formatTime(current)} / {formatTime(duration)}
                </span>

                <div className="ml-auto">
                  <button
                    onClick={enterFullscreen}
                    aria-label="Fullscreen"
                    className="p-1.5 sm:p-2 rounded hover:bg-white/10 transition text-white"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Range thumb styling */}
            <style>{`
              .trailer-seek::-webkit-slider-thumb,
              .trailer-volume::-webkit-slider-thumb {
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 9999px;
                background: #fff;
                border: 2px solid ${CYAN};
                cursor: pointer;
              }
              .trailer-volume::-webkit-slider-thumb {
                border-color: ${PURPLE};
              }
              .trailer-seek::-moz-range-thumb,
              .trailer-volume::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 9999px;
                background: #fff;
                border: 2px solid ${CYAN};
                cursor: pointer;
              }
              .trailer-volume::-moz-range-thumb {
                border-color: ${PURPLE};
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
