import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Image as ImageIcon,
  Film,
  Rocket,
  Calendar,
  Lock,
  DollarSign,
  Gift,
  Crown,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/developer/publish")({
  head: () => ({
    meta: [
      { title: "Publish Your Game — Umbrella Developer Portal" },
      {
        name: "description",
        content:
          "Submit your indie game to Umbrella. Reach millions of players with a 70% revenue share.",
      },
      { property: "og:title", content: "Publish Your Game — Umbrella" },
      {
        property: "og:description",
        content: "Join thousands of indie developers selling on Umbrella.",
      },
    ],
  }),
  component: PublishPage,
});

const GENRES = [
  "Action",
  "RPG",
  "Strategy",
  "Puzzle",
  "Horror",
  "Platformer",
  "Simulation",
  "Sports",
  "Indie",
  "Visual Novel",
  "Other",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Korean",
  "Simplified Chinese",
  "Russian",
  "Polish",
];

type Step = 1 | 2 | 3 | 4 | 5;

type Form = {
  title: string;
  shortDesc: string;
  fullDesc: string;
  genres: string[];
  tags: string[];
  studio: string;
  website: string;
  cover: string | null;
  screenshots: string[];
  trailerUrl: string;
  capsule: string | null;
  pricingModel: "paid" | "free" | "freemium";
  price: string;
  earlyAccess: boolean;
  earlyAccessDesc: string;
  releaseType: "now" | "schedule" | "soon";
  releaseDate: string;
  platforms: { win: boolean; mac: boolean; linux: boolean };
  ageRating: "everyone" | "teen" | "mature";
  minReq: { os: string; cpu: string; ram: string; gpu: string; storage: string };
  recReq: { os: string; cpu: string; ram: string; gpu: string; storage: string };
  languages: string[];
  controller: boolean;
  cloudSave: boolean;
  buildFile: { name: string; size: number } | null;
  agree: boolean;
};

const empty: Form = {
  title: "",
  shortDesc: "",
  fullDesc: "",
  genres: [],
  tags: [],
  studio: "",
  website: "",
  cover: null,
  screenshots: [],
  trailerUrl: "",
  capsule: null,
  pricingModel: "paid",
  price: "19.99",
  earlyAccess: false,
  earlyAccessDesc: "",
  releaseType: "now",
  releaseDate: "",
  platforms: { win: true, mac: false, linux: false },
  ageRating: "everyone",
  minReq: { os: "", cpu: "", ram: "", gpu: "", storage: "" },
  recReq: { os: "", cpu: "", ram: "", gpu: "", storage: "" },
  languages: ["English"],
  controller: false,
  cloudSave: false,
  buildFile: null,
  agree: false,
};

function PublishPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Form>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    setStep((s) => (Math.min(5, s + 1) as Step));
  }
  function prev() {
    setStep((s) => (Math.max(1, s - 1) as Step));
  }

  function submit() {
    if (!form.agree) {
      toast.error("Please accept the Developer Agreement");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen email="you@umbrella.gg" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-border">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, #ea34a9 0%, transparent 40%), radial-gradient(circle at 80% 60%, #7e5ecc 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 scanlines opacity-20" />
        <div className="relative container mx-auto px-4 lg:px-8 py-20 text-center">
          <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-4">
            // DEVELOPER PORTAL
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-gradient-pink mb-4">
            SHARE YOUR GAME WITH THE WORLD 🚀
          </h1>
          <p className="font-heading text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of indie developers selling on Umbrella.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {[
              ["12,400+", "GAMES PUBLISHED"],
              ["2.1M+", "PLAYERS"],
              ["70%", "REVENUE SHARE"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="glass pixel-border p-5"
                style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
              >
                <div className="font-display text-2xl text-gradient-pink mb-1">{n}</div>
                <div className="font-display text-[10px] tracking-wider text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display text-xs tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          >
            <Upload className="h-4 w-4" /> START PUBLISHING
          </button>
          <div className="mt-6">
            <Link
              to="/developer/dashboard"
              className="font-heading text-lg text-primary hover:underline"
            >
              Already publishing? Go to your dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={formRef} className="container mx-auto px-4 lg:px-8 py-12">
        <StepIndicator step={step} setStep={setStep} />

        <div className="mt-8 grid lg:grid-cols-[1fr_280px] gap-8">
          <div
            className="bg-card border-2 border-border p-6 md:p-8"
            style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && <StepBasic form={form} update={update} />}
                {step === 2 && <StepMedia form={form} update={update} />}
                {step === 3 && <StepPricing form={form} update={update} />}
                {step === 4 && (
                  <StepTechnical
                    form={form}
                    update={update}
                    uploadProgress={uploadProgress}
                    setUploadProgress={setUploadProgress}
                  />
                )}
                {step === 5 && <StepReview form={form} update={update} />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border-2 border-border font-display text-[10px] tracking-wider hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> BACK
              </button>
              <button
                onClick={() => toast.success("Saved as draft")}
                className="font-heading text-lg text-muted-foreground hover:text-primary transition"
              >
                Save as Draft
              </button>
              {step < 5 ? (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                >
                  CONTINUE <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  className="inline-flex items-center gap-2 px-5 py-3 font-display text-[10px] tracking-wider text-[var(--gray-deep)] border-2 border-[#1a1a1a]"
                  style={{
                    background: "var(--brand-green-1)",
                    boxShadow: "4px 4px 0 0 #1a1a1a, 0 0 24px rgba(100,255,0,0.5)",
                  }}
                >
                  SUBMIT FOR REVIEW
                </button>
              )}
            </div>
          </div>

          {/* Sidebar tip card */}
          <aside>
            <div
              className="glass pixel-border p-5 sticky top-24"
              style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
            >
              <div className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">
                // TIP
              </div>
              <p className="font-heading text-lg text-foreground/80 leading-snug">
                Great covers convert. Use bold readable type, a single hero subject, and a 460×215
                aspect for the storefront capsule.
              </p>
              <div className="mt-4 pt-4 border-t-2 border-border">
                <div className="font-display text-[10px] tracking-wider text-muted-foreground mb-2">
                  STEP {step} OF 5
                </div>
                <div className="h-2 bg-input border-2 border-border overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(step / 5) * 100}%`,
                      background: "var(--brand-pink-1)",
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.div>
  );
}

function StepIndicator({ step, setStep }: { step: Step; setStep: (s: Step) => void }) {
  const labels = ["BASIC", "MEDIA", "PRICING", "TECHNICAL", "REVIEW"];
  return (
    <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
      {labels.map((l, i) => {
        const idx = (i + 1) as Step;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={l} className="flex items-center flex-1">
            <button
              onClick={() => done && setStep(idx)}
              disabled={!done && !active}
              className={`flex flex-col items-center gap-2 ${done ? "cursor-pointer" : ""}`}
            >
              <div
                className={`h-10 w-10 border-2 flex items-center justify-center font-display text-xs ${
                  active
                    ? "border-primary text-primary"
                    : done
                    ? "border-[var(--brand-green-1)] text-[var(--brand-green-1)]"
                    : "border-border text-muted-foreground"
                }`}
                style={
                  active
                    ? { boxShadow: "0 0 16px rgba(234,52,169,0.6)" }
                    : undefined
                }
              >
                {done ? <Check className="h-4 w-4" /> : idx}
              </div>
              <div
                className={`font-display text-[9px] tracking-wider hidden sm:block ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l}
              </div>
            </button>
            {i < labels.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2"
                style={{ background: done ? "var(--brand-green-1)" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Reusable inputs ---
function Field({ label, hint, children }: any) {
  return (
    <label className="block">
      <div className="font-display text-[10px] tracking-wider text-primary mb-2">{label}</div>
      {children}
      {hint && <div className="font-heading text-sm text-muted-foreground mt-1">{hint}</div>}
    </label>
  );
}

function PixelInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary ${
        props.className ?? ""
      }`}
    />
  );
}

function PixelTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary min-h-[100px] ${
        props.className ?? ""
      }`}
    />
  );
}

// --- Step 1 ---
function StepBasic({ form, update }: { form: Form; update: any }) {
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const v = tagInput.trim();
    if (!v || form.tags.includes(v) || form.tags.length >= 10) return;
    update("tags", [...form.tags, v]);
    setTagInput("");
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gradient-pink">BASIC INFO</h2>

      <Field label={`GAME TITLE  (${form.title.length}/60)`}>
        <PixelInput
          maxLength={60}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Cyber Odyssey"
        />
      </Field>

      <Field label={`SHORT DESCRIPTION  (${form.shortDesc.length}/150)`}>
        <PixelInput
          maxLength={150}
          value={form.shortDesc}
          onChange={(e) => update("shortDesc", e.target.value)}
          placeholder="A neon-soaked open world where every choice shapes the city."
        />
      </Field>

      <Field label="FULL DESCRIPTION">
        <PixelTextarea
          rows={6}
          value={form.fullDesc}
          onChange={(e) => update("fullDesc", e.target.value)}
          placeholder="Tell players what makes your game special..."
        />
      </Field>

      <Field label="GENRES (multi-select)">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = form.genres.includes(g);
            return (
              <button
                key={g}
                onClick={() =>
                  update(
                    "genres",
                    active ? form.genres.filter((x: string) => x !== g) : [...form.genres, g],
                  )
                }
                className={`px-3 py-1.5 border-2 font-display text-[10px] tracking-wider transition ${
                  active
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "border-border hover:border-primary text-muted-foreground"
                }`}
              >
                {g.toUpperCase()}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={`TAGS  (${form.tags.length}/10)`} hint="Press Enter to add">
        <div className="flex gap-2">
          <PixelInput
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="cyberpunk"
          />
          <button
            onClick={addTag}
            className="px-3 py-2 bg-card border-2 border-border hover:border-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {form.tags.map((t: string) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground font-display text-[10px] tracking-wider"
              >
                {t}
                <button
                  onClick={() =>
                    update(
                      "tags",
                      form.tags.filter((x: string) => x !== t),
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="DEVELOPER / STUDIO">
          <PixelInput
            value={form.studio}
            onChange={(e) => update("studio", e.target.value)}
            placeholder="Neon Studios"
          />
        </Field>
        <Field label="WEBSITE (optional)">
          <PixelInput
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://yourstudio.gg"
          />
        </Field>
      </div>
    </div>
  );
}

// --- Step 2 ---
function StepMedia({ form, update }: { form: Form; update: any }) {
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    update("cover", await fileToDataUrl(f));
  }

  async function onCapsule(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    update("capsule", await fileToDataUrl(f));
  }

  async function onShots(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - form.screenshots.length);
    const urls = await Promise.all(files.map(fileToDataUrl));
    update("screenshots", [...form.screenshots, ...urls].slice(0, 8));
  }

  function getYouTubeEmbed(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return null;
  }

  const trailerEmbed = getYouTubeEmbed(form.trailerUrl);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gradient-pink">MEDIA</h2>

      <Field label="COVER IMAGE  (460×215 recommended, max 5MB)">
        <label
          className={`flex flex-col items-center justify-center gap-2 aspect-[460/215] border-2 border-dashed cursor-pointer transition ${
            form.cover ? "border-primary" : "border-border hover:border-primary"
          }`}
        >
          {form.cover ? (
            <img src={form.cover} alt="cover" className="h-full w-full object-cover" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="font-heading text-lg text-muted-foreground">
                Drag & drop or click to upload
              </div>
              <div className="font-display text-[10px] tracking-wider text-muted-foreground">
                PNG · JPG · WEBP
              </div>
            </>
          )}
          <input type="file" accept="image/*" onChange={onCover} className="hidden" />
        </label>
      </Field>

      <Field label={`SCREENSHOTS  (${form.screenshots.length}/8)`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {form.screenshots.map((s: string, i: number) => (
            <div key={i} className="relative aspect-video border-2 border-border overflow-hidden">
              <img src={s} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() =>
                  update(
                    "screenshots",
                    form.screenshots.filter((_: string, idx: number) => idx !== i),
                  )
                }
                className="absolute top-1 right-1 p-1 bg-card border-2 border-border hover:border-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {form.screenshots.length < 8 && (
            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border hover:border-primary cursor-pointer">
              <Plus className="h-6 w-6 text-muted-foreground" />
              <div className="font-display text-[9px] tracking-wider text-muted-foreground mt-1">
                ADD
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onShots}
                className="hidden"
              />
            </label>
          )}
        </div>
      </Field>

      <Field label="TRAILER URL (YouTube / Vimeo)">
        <PixelInput
          value={form.trailerUrl}
          onChange={(e) => update("trailerUrl", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
        {trailerEmbed && (
          <div className="aspect-video mt-3 border-2 border-primary overflow-hidden">
            <iframe
              src={trailerEmbed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          </div>
        )}
      </Field>

      <Field label="CAPSULE IMAGE  (231×87)">
        <label
          className={`flex items-center gap-3 border-2 border-dashed p-3 cursor-pointer transition ${
            form.capsule ? "border-primary" : "border-border hover:border-primary"
          }`}
          style={{ minHeight: 90 }}
        >
          {form.capsule ? (
            <img src={form.capsule} alt="capsule" className="h-[60px] w-[160px] object-cover" />
          ) : (
            <>
              <Film className="h-6 w-6 text-muted-foreground" />
              <div className="font-heading text-lg text-muted-foreground">
                Click to upload capsule
              </div>
            </>
          )}
          <input type="file" accept="image/*" onChange={onCapsule} className="hidden" />
        </label>
      </Field>
    </div>
  );
}

// --- Step 3 ---
function StepPricing({ form, update }: { form: Form; update: any }) {
  const models: { id: Form["pricingModel"]; icon: any; label: string }[] = [
    { id: "paid", icon: DollarSign, label: "Paid" },
    { id: "free", icon: Gift, label: "Free to Play" },
    { id: "freemium", icon: Crown, label: "Free + Premium DLC" },
  ];
  const releases: { id: Form["releaseType"]; icon: any; label: string }[] = [
    { id: "now", icon: Rocket, label: "Release Now" },
    { id: "schedule", icon: Calendar, label: "Schedule" },
    { id: "soon", icon: Lock, label: "Coming Soon" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gradient-pink">PRICING & RELEASE</h2>

      <Field label="PRICING MODEL">
        <div className="grid sm:grid-cols-3 gap-3">
          {models.map((m) => {
            const Icon = m.icon;
            const active = form.pricingModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => update("pricingModel", m.id)}
                className={`p-4 border-2 text-left transition ${
                  active ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                }`}
                style={active ? { boxShadow: "4px 4px 0 0 #1a1a1a" } : undefined}
              >
                <Icon className="h-6 w-6 text-primary mb-2" />
                <div className="font-display text-xs">{m.label.toUpperCase()}</div>
              </button>
            );
          })}
        </div>
      </Field>

      {form.pricingModel === "paid" && (
        <Field label="PRICE">
          <div className="flex gap-2">
            <select
              className="px-3 py-2 bg-input border-2 border-border font-heading text-lg outline-none focus:border-primary"
              defaultValue="USD"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <PixelInput
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </div>
        </Field>
      )}

      <div className="flex items-center justify-between p-4 bg-input border-2 border-border">
        <div>
          <div className="font-display text-[10px] tracking-wider text-primary">EARLY ACCESS</div>
          <div className="font-heading text-lg text-muted-foreground">
            Players know it's still in development
          </div>
        </div>
        <Toggle
          on={form.earlyAccess}
          onChange={(v) => update("earlyAccess", v)}
        />
      </div>

      {form.earlyAccess && (
        <Field label="EARLY ACCESS DESCRIPTION">
          <PixelTextarea
            rows={3}
            value={form.earlyAccessDesc}
            onChange={(e) => update("earlyAccessDesc", e.target.value)}
            placeholder="Why is this in Early Access? What's planned?"
          />
        </Field>
      )}

      <Field label="RELEASE TYPE">
        <div className="grid sm:grid-cols-3 gap-3">
          {releases.map((r) => {
            const Icon = r.icon;
            const active = form.releaseType === r.id;
            return (
              <button
                key={r.id}
                onClick={() => update("releaseType", r.id)}
                className={`p-4 border-2 transition ${
                  active ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                }`}
              >
                <Icon className="h-5 w-5 text-primary mb-2 mx-auto" />
                <div className="font-display text-[10px] tracking-wider text-center">
                  {r.label.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      {form.releaseType === "schedule" && (
        <Field label="RELEASE DATE">
          <PixelInput
            type="datetime-local"
            value={form.releaseDate}
            onChange={(e) => update("releaseDate", e.target.value)}
          />
        </Field>
      )}

      <Field label="SUPPORTED PLATFORMS">
        <div className="flex flex-wrap gap-3">
          {(["win", "mac", "linux"] as const).map((p) => {
            const labels = { win: "Windows", mac: "Mac", linux: "Linux" };
            return (
              <label
                key={p}
                className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border cursor-pointer hover:border-primary"
              >
                <input
                  type="checkbox"
                  checked={form.platforms[p]}
                  onChange={(e) =>
                    update("platforms", { ...form.platforms, [p]: e.target.checked })
                  }
                  className="accent-[var(--brand-pink-1)]"
                />
                <span className="font-heading text-lg">{labels[p]}</span>
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="AGE RATING">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["everyone", "Everyone"],
              ["teen", "Teen 13+"],
              ["mature", "Mature 17+"],
            ] as const
          ).map(([id, l]) => {
            const active = form.ageRating === id;
            return (
              <button
                key={id}
                onClick={() => update("ageRating", id)}
                className={`px-4 py-2 border-2 font-display text-[10px] tracking-wider ${
                  active
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "border-border hover:border-primary text-muted-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 border-2 border-[#1a1a1a] transition ${
        on ? "bg-[var(--brand-green-1)]" : "bg-input"
      }`}
    >
      <span
        className="absolute top-0 h-full w-5 bg-card border-2 border-[#1a1a1a] transition-all"
        style={{ left: on ? "calc(100% - 1.25rem)" : 0 }}
      />
    </button>
  );
}

// --- Step 4 ---
function StepTechnical({
  form,
  update,
  uploadProgress,
  setUploadProgress,
}: {
  form: Form;
  update: any;
  uploadProgress: number;
  setUploadProgress: (v: number) => void;
}) {
  const [langSearch, setLangSearch] = useState("");
  const filteredLangs = useMemo(
    () => LANGUAGES.filter((l) => l.toLowerCase().includes(langSearch.toLowerCase())),
    [langSearch],
  );

  function onBuildFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    update("buildFile", { name: f.name, size: f.size });
    let p = 0;
    setUploadProgress(0);
    const interval = setInterval(() => {
      p = Math.min(100, p + 7 + Math.random() * 10);
      setUploadProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 200);
  }

  function ReqGroup({ which, label }: { which: "minReq" | "recReq"; label: string }) {
    const r = form[which];
    return (
      <div
        className="bg-input border-2 border-border p-4"
        style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
      >
        <div className="font-display text-[10px] tracking-wider text-primary mb-3">{label}</div>
        <div className="space-y-2">
          {(["os", "cpu", "ram", "gpu", "storage"] as const).map((k) => (
            <PixelInput
              key={k}
              value={r[k]}
              onChange={(e) => update(which, { ...r, [k]: e.target.value })}
              placeholder={k.toUpperCase()}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gradient-pink">TECHNICAL</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <ReqGroup which="minReq" label="MINIMUM REQUIREMENTS" />
        <ReqGroup which="recReq" label="RECOMMENDED REQUIREMENTS" />
      </div>

      <Field label="SUPPORTED LANGUAGES">
        <PixelInput
          placeholder="Search languages..."
          value={langSearch}
          onChange={(e) => setLangSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {filteredLangs.map((l) => {
            const active = form.languages.includes(l);
            return (
              <button
                key={l}
                onClick={() =>
                  update(
                    "languages",
                    active
                      ? form.languages.filter((x: string) => x !== l)
                      : [...form.languages, l],
                  )
                }
                className={`px-3 py-1.5 border-2 font-display text-[10px] tracking-wider ${
                  active
                    ? "bg-primary text-primary-foreground border-[#1a1a1a]"
                    : "border-border hover:border-primary text-muted-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-4 bg-input border-2 border-border">
          <div className="font-heading text-lg">Controller Support</div>
          <Toggle on={form.controller} onChange={(v) => update("controller", v)} />
        </div>
        <div className="flex items-center justify-between p-4 bg-input border-2 border-border">
          <div className="font-heading text-lg">Cloud Save</div>
          <Toggle on={form.cloudSave} onChange={(v) => update("cloudSave", v)} />
        </div>
      </div>

      <Field label="GAME BUILD  (.zip / .exe up to 10GB)">
        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border hover:border-primary cursor-pointer">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="font-heading text-lg text-muted-foreground">
            Click to upload build
          </div>
          <input type="file" onChange={onBuildFile} className="hidden" />
        </label>
        {form.buildFile && (
          <div className="mt-3 p-3 bg-input border-2 border-border">
            <div className="flex items-center justify-between mb-2 font-heading text-lg">
              <span className="truncate">{form.buildFile.name}</span>
              <span className="text-muted-foreground text-sm shrink-0 ml-2">
                {(form.buildFile.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <div className="h-2 bg-card border-2 border-border overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${uploadProgress}%`,
                  background:
                    uploadProgress >= 100 ? "var(--brand-green-1)" : "var(--brand-pink-1)",
                }}
              />
            </div>
            <div className="font-display text-[10px] tracking-wider text-muted-foreground mt-1">
              {uploadProgress >= 100 ? "✓ UPLOAD COMPLETE" : `${Math.round(uploadProgress)}%`}
            </div>
          </div>
        )}
      </Field>
    </div>
  );
}

// --- Step 5 ---
function StepReview({ form, update }: { form: Form; update: any }) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-gradient-pink">REVIEW & SUBMIT</h2>

      {/* Storefront card preview */}
      <div>
        <div className="font-display text-[10px] tracking-wider text-primary mb-2">
          STOREFRONT PREVIEW
        </div>
        <div
          className="max-w-xs bg-card border-2 border-border overflow-hidden"
          style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}
        >
          <div className="aspect-[4/3] bg-input flex items-center justify-center">
            {form.cover ? (
              <img src={form.cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="p-3">
            <div className="font-display text-sm truncate">
              {form.title.toUpperCase() || "GAME TITLE"}
            </div>
            <div className="font-heading text-base text-muted-foreground truncate">
              {form.studio || "Studio Name"}
            </div>
            <div className="mt-2 font-display text-sm text-primary">
              {form.pricingModel === "free"
                ? "FREE"
                : form.pricingModel === "freemium"
                ? "FREE + DLC"
                : `$${form.price}`}
            </div>
          </div>
        </div>
      </div>

      <div
        className="grid md:grid-cols-2 gap-3 text-sm bg-input border-2 border-border p-4"
        style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
      >
        <SummaryRow k="Title" v={form.title} />
        <SummaryRow k="Studio" v={form.studio} />
        <SummaryRow k="Genres" v={form.genres.join(", ")} />
        <SummaryRow k="Tags" v={form.tags.join(", ")} />
        <SummaryRow k="Pricing" v={form.pricingModel} />
        {form.pricingModel === "paid" && <SummaryRow k="Price" v={`$${form.price}`} />}
        <SummaryRow k="Release" v={form.releaseType} />
        <SummaryRow
          k="Platforms"
          v={Object.entries(form.platforms)
            .filter(([, on]) => on)
            .map(([k]) => k)
            .join(", ")}
        />
        <SummaryRow k="Age Rating" v={form.ageRating} />
        <SummaryRow k="Languages" v={form.languages.join(", ")} />
        <SummaryRow k="Screenshots" v={`${form.screenshots.length} uploaded`} />
        <SummaryRow k="Build" v={form.buildFile?.name ?? "Not uploaded"} />
      </div>

      <label className="flex items-start gap-3 p-4 bg-input border-2 border-border cursor-pointer">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
          className="mt-1 accent-[var(--brand-pink-1)]"
        />
        <span className="font-heading text-lg">
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">
            Developer Agreement
          </a>{" "}
          and confirm I own the rights to all submitted content.
        </span>
      </label>
    </div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border pb-1.5 font-heading text-lg">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right truncate">{v || "—"}</span>
    </div>
  );
}

// --- Success ---
function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: -20, opacity: 1, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 800,
            y: 700,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, ease: "easeOut" }}
          className="absolute top-1/4 left-1/2"
          style={{
            width: 8,
            height: 12,
            background: ["#ea34a9", "#7e5ecc", "#64ff00", "#df158c"][i % 4],
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative text-center max-w-lg mx-auto px-6"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display text-2xl md:text-3xl text-gradient-pink mb-4">
          YOUR GAME HAS BEEN SUBMITTED!
        </h1>
        <p className="font-heading text-xl text-foreground/80 leading-snug mb-2">
          Our team will review it within 3–5 business days.
        </p>
        <p className="font-heading text-lg text-muted-foreground mb-8">
          You'll receive an email at <span className="text-primary">{email}</span> with updates.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/developer/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-display text-[10px] tracking-wider pixel-border-pink"
          >
            GO TO DASHBOARD
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-card border-2 border-border font-display text-[10px] tracking-wider hover:border-primary"
          >
            BACK TO STORE
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
