import { useCamera } from "@/camera/useCamera";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Clock,
  Download,
  FlipHorizontal,
  Image,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GpsCoords {
  lat: number;
  lon: number;
  accuracy: number;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  lat: number;
  lon: number;
  address: string;
  timestamp: Date;
}

interface CameraAppProps {
  onBack: () => void;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return "Unknown location";
    const data = await res.json();
    const addr = data.address;
    const parts = [
      addr.road || addr.pedestrian,
      addr.city || addr.town || addr.village || addr.county,
      addr.country,
    ].filter(Boolean);
    return parts.join(", ") || data.display_name || "Unknown location";
  } catch {
    return "Unknown location";
  }
}

function formatCoord(val: number, posLabel: string, negLabel: string): string {
  return `${Math.abs(val).toFixed(5)}\u00b0 ${val >= 0 ? posLabel : negLabel}`;
}

export default function CameraApp({ onBack }: CameraAppProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "gallery">("camera");
  const [gps, setGps] = useState<GpsCoords | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("Locating...");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<CapturedPhoto | null>(null);
  const stampCanvasRef = useRef<HTMLCanvasElement>(null);
  const watchIdRef = useRef<number | null>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    quality: 0.92,
    format: "image/jpeg",
  });

  // GPS watch
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported");
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGpsError(null);
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Reverse geocode on coord change
  useEffect(() => {
    if (!gps) return;
    setAddress("Locating...");
    reverseGeocode(gps.lat, gps.lon).then(setAddress);
  }, [gps]);

  // Auto-start / stop camera with tab
  useEffect(() => {
    if (activeTab === "gallery" && isActive) {
      stopCamera();
    } else if (
      activeTab === "camera" &&
      !isActive &&
      !isLoading &&
      isSupported
    ) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isSupported, isActive, isLoading, startCamera, stopCamera]);

  const stampAndCapture = useCallback(async () => {
    if (
      !isActive ||
      !videoRef.current ||
      !canvasRef.current ||
      !stampCanvasRef.current
    )
      return;
    if (capturing) return;

    setCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = stampCanvasRef.current;
      const W = video.videoWidth || 1280;
      const H = video.videoHeight || 720;
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, W, H);

      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const latStr = gps ? formatCoord(gps.lat, "N", "S") : "GPS Unavailable";
      const lonStr = gps ? formatCoord(gps.lon, "E", "W") : "";
      const accStr = gps ? `\u00b1${Math.round(gps.accuracy)}m` : "";
      const addrStr = address !== "Locating..." ? address : "";

      const padding = Math.round(W * 0.018);
      const lineH = Math.round(H * 0.038);
      const fontSize = Math.round(H * 0.028);
      const lines = [
        `${latStr}  ${lonStr}  ${accStr}`,
        addrStr,
        `${dateStr}  ${timeStr}`,
      ].filter(Boolean);
      const boxH = lines.length * lineH + padding * 2;

      ctx.fillStyle = "rgba(10, 20, 40, 0.78)";
      ctx.fillRect(0, H - boxH, W, boxH);

      ctx.fillStyle = "#2F80ED";
      ctx.fillRect(0, H - boxH, 6, boxH);

      ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
      ctx.fillStyle = "#FFFFFF";
      lines.forEach((line, idx) => {
        ctx.fillText(
          line,
          padding + 10,
          H - boxH + padding + lineH * idx + lineH * 0.75,
        );
      });

      ctx.font = `${Math.round(fontSize * 0.8)}px 'Courier New', monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "right";
      ctx.fillText(
        "GeoCam Live",
        W - padding,
        H - boxH + padding + lineH * 0.75,
      );
      ctx.textAlign = "left";

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const photo: CapturedPhoto = {
        id: crypto.randomUUID(),
        dataUrl,
        lat: gps?.lat ?? 0,
        lon: gps?.lon ?? 0,
        address,
        timestamp: now,
      };

      setPhotos((prev) => [photo, ...prev]);
      setPreviewPhoto(photo);
      toast.success("Photo captured with GPS stamp!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to capture photo.");
    } finally {
      setCapturing(false);
    }
  }, [isActive, videoRef, canvasRef, gps, address, capturing]);

  const downloadPhoto = (photo: CapturedPhoto) => {
    const a = document.createElement("a");
    a.href = photo.dataUrl;
    a.download = `geocam-${photo.timestamp.toISOString().replace(/[:.]/g, "-")}.jpg`;
    a.click();
  };

  const openPreview = (photo: CapturedPhoto) => setPreviewPhoto(photo);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.12 0.03 245)" }}
    >
      {/* App Header */}
      <header
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "oklch(0.16 0.04 245)",
          borderColor: "oklch(1 0 0 / 0.08)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          data-ocid="nav.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.58 0.19 255)" }}
          >
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">
            GeoCam <span style={{ color: "oklch(0.75 0.14 215)" }}>Live</span>
          </span>
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: "oklch(0.22 0.04 245)" }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background:
                activeTab === "camera" ? "oklch(0.58 0.19 255)" : "transparent",
              color: activeTab === "camera" ? "white" : "oklch(1 0 0 / 0.55)",
            }}
            data-ocid="camera.tab"
          >
            <Camera className="w-3.5 h-3.5" />
            Camera
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all relative"
            style={{
              background:
                activeTab === "gallery"
                  ? "oklch(0.58 0.19 255)"
                  : "transparent",
              color: activeTab === "gallery" ? "white" : "oklch(1 0 0 / 0.55)",
            }}
            data-ocid="gallery.tab"
          >
            <Image className="w-3.5 h-3.5" />
            Gallery
            {photos.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.72 0.18 50)", color: "white" }}
              >
                {photos.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "camera" ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {/* GPS Bar */}
              <div
                className="px-4 py-2 flex items-center gap-3"
                style={{ background: "oklch(0.14 0.04 245)" }}
              >
                {gpsError ? (
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "oklch(0.70 0.18 30)" }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>GPS: {gpsError}</span>
                  </div>
                ) : gps ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "oklch(0.68 0.18 145)" }}
                      />
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: "oklch(0.68 0.18 145)" }}
                      >
                        GPS LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <span className="font-mono text-xs text-white/90 whitespace-nowrap">
                        {formatCoord(gps.lat, "N", "S")}
                      </span>
                      <span className="font-mono text-xs text-white/90 whitespace-nowrap">
                        {formatCoord(gps.lon, "E", "W")}
                      </span>
                      <span className="font-mono text-xs text-white/50 whitespace-nowrap">
                        \u00b1{Math.round(gps.accuracy)}m
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Acquiring GPS signal...
                  </div>
                )}
                <div className="ml-auto flex items-center gap-1 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Camera Viewfinder */}
              <div
                className="relative flex-1 overflow-hidden"
                style={{
                  minHeight: "300px",
                  background: "oklch(0.08 0.02 245)",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ minHeight: "300px" }}
                />
                <canvas ref={canvasRef} className="hidden" />
                <canvas ref={stampCanvasRef} className="hidden" />

                {isLoading && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    data-ocid="camera.loading_state"
                  >
                    <Loader2
                      className="w-10 h-10 animate-spin"
                      style={{ color: "oklch(0.58 0.19 255)" }}
                    />
                    <p className="text-white/60 text-sm">Starting camera...</p>
                  </div>
                )}

                {!isLoading && error && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
                    data-ocid="camera.error_state"
                  >
                    <AlertTriangle
                      className="w-12 h-12"
                      style={{ color: "oklch(0.70 0.18 30)" }}
                    />
                    <p className="text-white font-medium">Camera Error</p>
                    <p className="text-white/60 text-sm">{error.message}</p>
                    <Button
                      onClick={() => startCamera()}
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {isSupported === false && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
                    data-ocid="camera.error_state"
                  >
                    <Camera className="w-12 h-12 text-white/30" />
                    <p className="text-white font-medium">
                      Camera Not Supported
                    </p>
                    <p className="text-white/60 text-sm">
                      Your browser doesn't support camera access. Please try
                      Chrome or Safari.
                    </p>
                  </div>
                )}

                {isActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[
                      "top-4 left-4",
                      "top-4 right-4",
                      "bottom-16 left-4",
                      "bottom-16 right-4",
                    ].map((pos, i) => (
                      <div
                        key={pos}
                        className={`absolute w-8 h-8 ${pos}`}
                        style={{
                          borderColor: "oklch(0.58 0.19 255 / 0.8)",
                          borderStyle: "solid",
                          borderWidth:
                            i === 0
                              ? "2px 0 0 2px"
                              : i === 1
                                ? "2px 2px 0 0"
                                : i === 2
                                  ? "0 0 2px 2px"
                                  : "0 2px 2px 0",
                        }}
                      />
                    ))}

                    {address && address !== "Locating..." && (
                      <div className="absolute bottom-4 left-4 right-4 gps-badge px-3 py-2">
                        <div className="flex items-start gap-2">
                          <MapPin
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                            style={{ color: "oklch(0.58 0.19 255)" }}
                          />
                          <p className="text-white text-xs leading-snug line-clamp-2">
                            {address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ background: "oklch(0.14 0.04 245)" }}
              >
                <button
                  type="button"
                  onClick={() => switchCamera()}
                  disabled={!isActive || isLoading}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "oklch(0.22 0.04 245)", color: "white" }}
                  title="Switch Camera"
                  data-ocid="camera.toggle"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={stampAndCapture}
                  disabled={!isActive || capturing || isLoading}
                  className="relative w-20 h-20 rounded-full transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: capturing
                      ? "oklch(0.58 0.19 255 / 0.7)"
                      : "white",
                    boxShadow: "0 0 0 4px oklch(0.58 0.19 255 / 0.4)",
                  }}
                  aria-label="Capture photo"
                  data-ocid="camera.primary_button"
                >
                  {capturing ? (
                    <Loader2
                      className="w-8 h-8 animate-spin absolute inset-0 m-auto"
                      style={{ color: "oklch(0.58 0.19 255)" }}
                    />
                  ) : (
                    <Camera
                      className="w-8 h-8 absolute inset-0 m-auto"
                      style={{ color: "oklch(0.22 0.04 245)" }}
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("gallery")}
                  className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center transition-all"
                  style={{
                    background: photos[0]
                      ? "transparent"
                      : "oklch(0.22 0.04 245)",
                    border: "2px solid oklch(1 0 0 / 0.2)",
                  }}
                  aria-label="Open gallery"
                  data-ocid="gallery.tab"
                >
                  {photos[0] ? (
                    <img
                      src={photos[0].dataUrl}
                      alt="Latest captured"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-5 h-5 text-white/50" />
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
              className="flex-1 p-4"
            >
              {photos.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 py-24 text-center"
                  data-ocid="gallery.empty_state"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.22 0.04 245)" }}
                  >
                    <Image className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/60 font-medium">No photos yet</p>
                  <p className="text-white/35 text-sm">
                    Switch to Camera and capture your first geo-tagged photo!
                  </p>
                  <Button
                    onClick={() => setActiveTab("camera")}
                    variant="outline"
                    className="mt-2 border-white/20 text-white/80 hover:bg-white/10"
                    data-ocid="camera.tab"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      className="break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer w-full text-left"
                      onClick={() => openPreview(photo)}
                      aria-label={`View geo-tagged snapshot ${i + 1}`}
                      data-ocid={`gallery.item.${i + 1}`}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Geo-tagged snapshot ${i + 1}`}
                        className="w-full object-cover"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        style={{ background: "oklch(0.1 0.04 245 / 0.6)" }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPhoto(photo);
                          }}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                          style={{ background: "oklch(0.58 0.19 255)" }}
                          aria-label="Download"
                          data-ocid={`gallery.delete_button.${i + 1}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
                        style={{
                          background:
                            "linear-gradient(to top, oklch(0.08 0.04 245 / 0.9), transparent)",
                        }}
                      >
                        <p className="text-white text-[10px] font-mono">
                          {photo.lat.toFixed(4)}\u00b0, {photo.lon.toFixed(4)}
                          \u00b0
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog
        open={!!previewPhoto}
        onOpenChange={(open) => !open && setPreviewPhoto(null)}
      >
        <DialogContent
          className="max-w-2xl w-full p-0 overflow-hidden"
          style={{
            background: "oklch(0.12 0.03 245)",
            border: "1px solid oklch(1 0 0 / 0.1)",
          }}
          data-ocid="gallery.dialog"
        >
          {previewPhoto && (
            <>
              <div className="relative">
                <img
                  src={previewPhoto.dataUrl}
                  alt="Full preview of captured geo-tagged snap"
                  className="w-full object-contain max-h-[70vh]"
                />
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.1 0 0 / 0.7)" }}
                  aria-label="Close preview"
                  data-ocid="gallery.close_button"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin
                      className="w-4 h-4"
                      style={{ color: "oklch(0.58 0.19 255)" }}
                    />
                    <p className="text-white text-sm font-medium">
                      {previewPhoto.address}
                    </p>
                  </div>
                  <p
                    className="font-mono text-xs"
                    style={{ color: "oklch(1 0 0 / 0.5)" }}
                  >
                    {formatCoord(previewPhoto.lat, "N", "S")} \u00b7{" "}
                    {formatCoord(previewPhoto.lon, "E", "W")}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(1 0 0 / 0.4)" }}
                  >
                    {previewPhoto.timestamp.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => downloadPhoto(previewPhoto)}
                  className="gap-2"
                  style={{ background: "oklch(0.58 0.19 255)" }}
                  data-ocid="gallery.primary_button"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
