"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const next = Math.min((elapsed / duration) * 100, 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
      <motion.div
        exit={{
          opacity: 0,
          scale: 1.02,
          transition: { duration: 1, ease: "easeInOut" },
        }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] px-6"
      >
        <div className="flex flex-col items-center w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono font-bold text-2xl md:text-3xl tracking-[0.3em] text-white mb-8"
          >
            YSM.
          </motion.div>

          <div className="w-full h-[1px] bg-gray-900 relative overflow-hidden mb-4">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-widest text-gray-500">
            <span>Loading</span>
            <span className="text-white">{Math.floor(progress)}%</span>
          </div>
        </div>
      </motion.div>
  );
}
