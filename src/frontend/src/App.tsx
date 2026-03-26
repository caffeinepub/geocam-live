import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import CameraApp from "./components/CameraApp";
import LandingPage from "./components/LandingPage";

export type AppView = "landing" | "camera";

export default function App() {
  const [view, setView] = useState<AppView>("landing");

  return (
    <>
      {view === "landing" ? (
        <LandingPage onLaunchApp={() => setView("camera")} />
      ) : (
        <CameraApp onBack={() => setView("landing")} />
      )}
      <Toaster />
    </>
  );
}
