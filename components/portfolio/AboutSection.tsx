"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SKILLS } from "@/lib/portfolio/constants";
import { useCursorHandlers } from "./CustomCursor";

interface AboutSectionProps {
  onContactClick: () => void;
  setIsCursorHovered: (v: boolean) => void;
}

export default function AboutSection({
  onContactClick,
  setIsCursorHovered,
}: AboutSectionProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);
  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isPhotoClicked, setIsPhotoClicked] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-primary)]/95 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
            01 / Обо мне
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-snug mb-6">
            Я создаю продукты, которые решают задачи через чистый код и
            глубокую логику
          </h2>
          <p className="text-gray-400 font-light text-sm md:text-lg leading-relaxed mb-6">
            Full-stack разработка — это не просто написание строчек на Go или
            React. Это проектирование систем, которые работают безупречно под
            нагрузкой.
          </p>

          {/* Skills grid */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-wider border border-white/10 rounded-full text-gray-400 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>

          <button
            onClick={onContactClick}
            {...cursor}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-white text-black font-medium overflow-hidden rounded-full cursor-auto md:cursor-none text-sm md:text-base w-full md:w-auto text-center"
          >
            <span className="relative z-10 group-hover:text-black transition-colors">
              Связаться со мной
            </span>
            <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-[320px] md:max-w-full aspect-[4/5] mx-auto rounded-2xl overflow-hidden border border-white/10"
          onMouseEnter={() => {
            setIsCursorHovered(true);
            setIsPhotoHovered(true);
          }}
          onMouseLeave={() => {
            setIsCursorHovered(false);
            setIsPhotoHovered(false);
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMaskPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          onClick={() => setIsPhotoClicked(!isPhotoClicked)}
        >
          {photoError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-surface)] to-[#1a1a2e] flex items-center justify-center">
              <span className="text-6xl md:text-8xl font-bold text-white/10 select-none">
                AB
              </span>
            </div>
          ) : (
            <>
              <img
                src="/my_photo.jpg"
                alt="Amir"
                className="absolute inset-0 w-full h-full object-cover grayscale blur-md opacity-60"
                onError={() => setPhotoError(true)}
              />
              <img
                src="/my_photo.jpg"
                alt="Amir"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                style={{
                  WebkitMaskImage: isPhotoClicked
                    ? "none"
                    : isPhotoHovered
                      ? `radial-gradient(circle 100px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 100%)`
                      : "none",
                  maskImage: isPhotoClicked
                    ? "none"
                    : isPhotoHovered
                      ? `radial-gradient(circle 100px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 100%)`
                      : "none",
                  opacity: isPhotoClicked || isPhotoHovered ? 1 : 0,
                }}
                onError={() => setPhotoError(true)}
              />
            </>
          )}
          {!isPhotoClicked && !isPhotoHovered && !photoError && (
            <p className="font-mono text-gray-400 text-[10px] tracking-[0.2em] uppercase z-10 pointer-events-none absolute inset-0 flex items-center justify-center text-center px-4">
              [ Нажми / наведи ]
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
