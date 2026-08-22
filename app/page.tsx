"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import BootScreen from "@/components/os/BootScreen";
import MacDesktop from "@/components/os/MacDesktop";
import IOSHome from "@/components/os/IOSHome";
import { LocaleProvider } from "@/context/LocaleContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { MusicProvider } from "@/context/MusicContext";
import { useIsMobile } from "@/hooks/useIsMobile";

function PortfolioInner() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const handleBootComplete = useCallback(() => setIsLoading(false), []);

  return (
    <div className="bg-black min-h-screen overflow-hidden font-sans antialiased">
      <AnimatePresence mode="wait">
        {isLoading && (
          <BootScreen isMobile={isMobile} onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>{isMobile ? <IOSHome /> : <MacDesktop />}</>
      )}
    </div>
  );
}

export default function Portfolio() {
  return (
    <LocaleProvider>
      <SettingsProvider>
        <MusicProvider>
          <PortfolioInner />
        </MusicProvider>
      </SettingsProvider>
    </LocaleProvider>
  );
}
