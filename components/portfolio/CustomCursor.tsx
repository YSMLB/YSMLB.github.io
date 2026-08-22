"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

interface CustomCursorProps {
  isHovered: boolean;
}

export default function CustomCursor({ isHovered }: CustomCursorProps) {
  const cursorX = useSpring(0, { stiffness: 400, damping: 28, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 28, mass: 0.5 });

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - (isHovered ? 24 : 16));
      cursorY.set(e.clientY - (isHovered ? 24 : 16));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, isHovered]);

  return (
    <motion.div
      className="hidden md:flex fixed top-0 left-0 border rounded-full pointer-events-none z-[999] mix-blend-difference items-center justify-center"
      style={{ x: cursorX, y: cursorY }}
      animate={{
        width: isHovered ? 48 : 32,
        height: isHovered ? 48 : 32,
        backgroundColor: isHovered ? "rgba(255, 255, 255, 0.1)" : "transparent",
        borderColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)",
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-full"
        animate={{
          width: isHovered ? 0 : 4,
          height: isHovered ? 0 : 4,
        }}
      />
    </motion.div>
  );
}

export function useCursorHandlers(
  setIsHovered: (v: boolean) => void
) {
  return {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
}
