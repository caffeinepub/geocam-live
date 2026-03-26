import { Button } from "@/components/ui/button";
import {
  Camera,
  Download,
  Github,
  Image,
  Instagram,
  MapPin,
  Menu,
  Navigation,
  Star,
  Twitter,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface LandingPageProps {
  onLaunchApp: () => void;
}

const features = [
  {
    icon: Navigation,
    title: "Live GPS Overlay",
    description:
      "Real-time latitude & longitude coordinates displayed directly on your camera viewfinder as you frame your shot.",
    color: "oklch(0.58 0.19 255 / 0.12)",
    iconColor: "oklch(0.58 0.19 255)",
  },
  {
    icon: Camera,
    title: "Instant Photo Capture",
    description:
      "Capture high-quality photos with a single tap. GPS data is baked into the image the moment you press the shutter.",
    color: "oklch(0.55 0.16 220 / 0.12)",
    iconColor: "oklch(0.55 0.16 220)",
  },
  {
    icon: MapPin,
    title: "Precise Geo-Stamping",
    description:
      "Each photo gets a permanent GPS stamp with coordinates, date, time, and reverse-geocoded address for location context.",
    color: "oklch(0.52 0.15 200 / 0.12)",
    iconColor: "oklch(0.52 0.15 200)",
  },
  {
    icon: Image,
    title: "Built-in Photo Gallery",
    description:
      "Browse all your geo-tagged photos in the built-in gallery. Tap to enlarge and download any photo to your device.",
    color: "oklch(0.50 0.14 260 / 0.12)",
    iconColor: "oklch(0.50 0.14 260)",
  },
];

const galleryPhotos = [
  {
    src: "/assets/generated/gallery-photo-1.dim_400x300.jpg",
    location: "Paris, France",
    coords: "48.8566\u00b0 N, 2.3522\u00b0 E",
  },
  {
    src: "/assets/generated/gallery-photo-2.dim_400x500.jpg",
    location: "Chamonix, France",
    coords: "45.8326\u00b0 N, 6.8652\u00b0 E",
  },
  {
    src: "/assets/generated/gallery-photo-3.dim_400x300.jpg",
    location: "Miami, FL",
    coords: "25.7617\u00b0 N, 80.1918\u00b0 W",
  },
  {
    src: "/assets/generated/gallery-photo-4.dim_400x400.jpg",
    location: "Tokyo, Japan",
    coords: "35.6762\u00b0 N, 139.6503\u00b0 E",
  },
  {
    src: "/assets/generated/gallery-photo-5.dim_400x500.jpg",
    location: "Seattle, WA",
    coords: "47.6062\u00b0 N, 122.3321\u00b0 W",
  },
  {
    src: "/assets/generated/gallery-photo-6.dim_400x300.jpg",
    location: "Grand Canyon, AZ",
    coords: "36.1069\u00b0 N, 112.1129\u00b0 W",
  },
];

const navLinks = ["Home", "Features", "Gallery", "Pricing", "Support"];

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-xs"
        data-ocid="nav.panel"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
            data-ocid="nav.link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.58 0.19 255)" }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-[1.1rem] tracking-tight text-foreground">
              GeoCam <span style={{ color: "oklch(0.58 0.19 255)" }}>Live</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => {
                  const el = document.getElementById(link.toLowerCase());
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onLaunchApp}
              className="hidden sm:flex items-center gap-2"
              style={{ background: "oklch(0.58 0.19 255)" }}
              data-ocid="nav.primary_button"
            >
              <Camera className="w-4 h-4" />
              Launch App
            </Button>
            <button
              type="button"
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById(link.toLowerCase());
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-muted-foreground py-1 text-left"
                data-ocid="nav.link"
              >
                {link}
              </button>
            ))}
            <Button
              onClick={onLaunchApp}
              className="w-full mt-2"
              style={{ background: "oklch(0.58 0.19 255)" }}
              data-ocid="nav.primary_button"
            >
              Launch App
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative min-h-[600px] flex items-center overflow-hidden"
        >
          <img
            src="/assets/generated/hero-mountain.dim_1400x700.jpg"
            alt="Mountain landscape background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 hero-gradient" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-white"
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
                  style={{
                    background: "oklch(0.58 0.19 255 / 0.25)",
                    border: "1px solid oklch(0.58 0.19 255 / 0.5)",
                  }}
                >
                  <Star
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.85 0.18 85)" }}
                  />
                  <span>Trusted by 50,000+ travelers worldwide</span>
                </div>

                <h1
                  className="font-display font-bold leading-tight mb-5"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
                >
                  Capture the Moment, <br />
                  <span style={{ color: "oklch(0.78 0.16 215)" }}>
                    Mark the Place.
                  </span>
                </h1>

                <p className="text-lg text-white/80 mb-8 max-w-md leading-relaxed">
                  GeoCam Live stamps every photo with precise GPS coordinates,
                  address, and timestamp — perfect for travelers, field workers,
                  and adventurers.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={onLaunchApp}
                    size="lg"
                    className="font-semibold gap-2 px-7"
                    style={{
                      background: "oklch(0.58 0.19 255)",
                      color: "white",
                    }}
                    data-ocid="hero.primary_button"
                  >
                    <Camera className="w-5 h-5" />
                    Try It Free
                  </Button>

                  <div className="flex gap-3 items-center">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                      style={{
                        background: "oklch(0.1 0 0 / 0.7)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      data-ocid="hero.secondary_button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3.18 23.76c.32.18.68.24 1.04.18l12.07-12.07L13.26 8.8zM.5 1.25C.18 1.6 0 2.1 0 2.76v18.48c0 .66.18 1.16.5 1.51l.08.08 10.35-10.35v-.24L.58 1.17zM22.26 10.7l-2.95-1.68L16.02 12l3.29 3.29 2.96-1.69c.84-.48.84-1.26-.01-1.9zM4.22.06L16.29 12.1 13.26 15.2 1.19.26c.35-.38.78-.37 1.16-.1z" />
                      </svg>
                      Google Play
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                      style={{
                        background: "oklch(0.1 0 0 / 0.7)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      data-ocid="hero.secondary_button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="hidden md:flex justify-center items-end"
              >
                <img
                  src="/assets/generated/phone-mockup.dim_400x700.png"
                  alt="GeoCam Live app on a smartphone"
                  className="max-h-[520px] w-auto drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2
                className="font-display font-bold text-foreground mb-4"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}
              >
                Everything You Need for Geo-Tagged Photography
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Professional-grade GPS stamping built right into your browser —
                no app install required.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl p-6 border border-border shadow-xs hover:shadow-card-hover transition-shadow"
                  style={{ background: "white" }}
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: feature.color }}
                  >
                    <feature.icon
                      className="w-6 h-6"
                      style={{ color: feature.iconColor }}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          id="gallery"
          className="py-20"
          style={{ background: "oklch(0.96 0.015 240)" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="font-display font-bold text-foreground mb-4"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}
              >
                Geo-Tagged Moments Around the World
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Every photo tells a story — now with the exact coordinates of
                where it happened.
              </p>
            </motion.div>

            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {galleryPhotos.map((photo, i) => (
                <motion.div
                  key={photo.location}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden relative group shadow-xs hover:shadow-card-hover transition-shadow"
                  data-ocid={`gallery.item.${i + 1}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.location}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2 translate-y-1 group-hover:translate-y-0 transition-transform"
                    style={{
                      background:
                        "linear-gradient(to top, oklch(0.12 0.05 250 / 0.9), transparent)",
                    }}
                  >
                    <p className="text-white text-xs font-medium">
                      {photo.location}
                    </p>
                    <p className="text-white/70 text-[11px] font-mono">
                      {photo.coords}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                onClick={onLaunchApp}
                size="lg"
                className="gap-2 font-semibold"
                style={{ background: "oklch(0.58 0.19 255)" }}
                data-ocid="gallery.primary_button"
              >
                <Camera className="w-5 h-5" />
                Start Taking Geo Photos
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-14 bg-white border-y border-border">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "2M+", label: "Photos Geo-Tagged" },
                { value: "4.9", label: "App Store Rating" },
                { value: "150+", label: "Countries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-display font-bold mb-1"
                    style={{ fontSize: "2rem", color: "oklch(0.58 0.19 255)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--footer-bg)" }} className="text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.19 255)" }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">
                  GeoCam Live
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Professional GPS photo stamping for explorers, professionals,
                and memory makers.
              </p>
            </div>

            <div className="sm:text-center">
              <p className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wide">
                Quick Links
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Features",
                  "Gallery",
                  "Pricing",
                  "Support",
                  "Privacy Policy",
                ].map((link) => (
                  <button
                    key={link}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(link.toLowerCase());
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white/60 hover:text-white text-sm transition-colors text-left sm:text-center"
                    data-ocid="nav.link"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:text-right">
              <p className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wide">
                Download
              </p>
              <div className="flex flex-col gap-3 sm:items-end">
                <button
                  type="button"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
                  data-ocid="nav.link"
                >
                  <Download className="w-4 h-4" /> Google Play Store
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
                  data-ocid="nav.link"
                >
                  <Download className="w-4 h-4" /> Apple App Store
                </button>
                <div className="flex gap-4 mt-2 sm:justify-end">
                  <button
                    type="button"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t text-center text-sm"
            style={{
              borderColor: "oklch(1 0 0 / 0.1)",
              color: "oklch(1 0 0 / 0.4)",
            }}
          >
            \u00a9 {year} GeoCam Live. Built with \u2764\ufe0f using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="underline hover:text-white/80 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
