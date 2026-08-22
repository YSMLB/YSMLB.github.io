"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  isMobile: boolean;
  onComplete: () => void;
}

export default function BootScreen({ isMobile, onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "loading" | "done">("logo");

  const finish = useCallback(() => {
    setPhase("done");
    setTimeout(onComplete, isMobile ? 400 : 500);
  }, [isMobile, onComplete]);

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("loading"), isMobile ? 400 : 600);
    return () => clearTimeout(logoTimer);
  }, [isMobile]);

  useEffect(() => {
    if (phase !== "loading") return;
    const duration = isMobile ? 1600 : 2000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min((elapsed / duration) * 100, 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(interval);
        finish();
      }
    }, 16);
    return () => clearInterval(interval);
  }, [phase, isMobile, finish]);

  const bg = isMobile ? "bg-black" : "bg-[#000000]";

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
      className={`fixed inset-0 z-[200] ${bg} flex flex-col items-center justify-center`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: phase === "done" ? 0 : 1,
          scale: phase === "loading" ? 0.92 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="mb-12"
      >
        <svg
          width={isMobile ? 44 : 52}
          height={isMobile ? 54 : 64}
          viewBox="0 0 814 1000"
          fill="white"
        >
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-163.7-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.2 0 130.9 2.6 198.3 99.2zm-234-181.1c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.2 32.4-54.4 83.6-54.4 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.8-71.3z" />
        </svg>
      </motion.div>

      {phase === "loading" && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: isMobile ? 120 : 180 }}
          className="h-[3px] bg-white/15 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-white/90 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </motion.div>
      )}

      {!isMobile && phase === "loading" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-white/35 text-[13px] tabular-nums"
        >
          {Math.floor(progress)}%
        </motion.p>
      )}
    </motion.div>
  );
}
