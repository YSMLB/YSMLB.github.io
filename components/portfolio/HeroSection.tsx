"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STATS } from "@/lib/portfolio/constants";
import { useCursorHandlers } from "./CustomCursor";
import type { ModelSettings } from "./Scene3D";

interface GitHubRepo {
  title: string;
  desc: string;
  date: string;
  url?: string;
}

interface HeroSectionProps {
  onNavigate: (id: "projects" | "contact") => void;
  onContactClick: () => void;
  setIsCursorHovered: (v: boolean) => void;
  modelSettings: ModelSettings;
  onModelSettingsChange: (settings: ModelSettings) => void;
}

export default function HeroSection({
  onNavigate,
  onContactClick,
  setIsCursorHovered,
  modelSettings,
  onModelSettingsChange,
}: HeroSectionProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [githubProjects, setGithubProjects] = useState<GitHubRepo[]>([
    { title: "LOADING...", desc: "Connecting to GitHub", date: "..." },
  ]);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/users/YSMLB/repos?sort=updated&per_page=5")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGithubProjects(
            data.map((repo: { name: string; description: string | null; updated_at: string; html_url: string }) => ({
              title: repo.name,
              desc:
                repo.description ||
                "System architecture component / No description.",
              date: new Date(repo.updated_at)
                .toLocaleDateString("ru-RU")
                .replace(/\./g, "."),
              url: repo.html_url,
            }))
          );
        }
      })
      .catch(() => {
        setGithubProjects([
          { title: "API_TIMEOUT", desc: "Failed to connect to GitHub.", date: "..." },
        ]);
      });
  }, []);

  useEffect(() => {
    if (githubProjects.length > 1) {
      const interval = setInterval(() => {
        setNewsIndex((prev) => (prev + 1) % githubProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [githubProjects]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-28 md:pb-16 px-4 md:px-8 pointer-events-none"
    >
      {/* Gradient overlay for readability over 3D */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-[var(--bg-primary)]/40 to-[var(--bg-primary)]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/70 via-transparent to-transparent pointer-events-none md:block hidden" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
        {/* Main hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-auto max-w-2xl"
        >
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Backend & Full-Stack Developer
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-4 md:mb-6">
            AMIR
          </h1>
          <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed mb-8 max-w-lg">
            Создаю продукты на Go, C# и React — от архитектуры до интерфейса
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
            <button
              onClick={() => onNavigate("projects")}
              {...cursor}
              className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-medium rounded-full hover:bg-[var(--accent)] transition-colors duration-300 cursor-auto md:cursor-none text-sm md:text-base"
            >
              Смотреть работы
            </button>
            <button
              onClick={onContactClick}
              {...cursor}
              className="px-6 py-3 md:px-8 md:py-4 border border-white/20 text-white font-medium rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300 cursor-auto md:cursor-none text-sm md:text-base"
            >
              Связаться
            </button>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-4 md:gap-8 font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-500">
            {STATS.map((stat, i) => (
              <span key={stat.label} className="flex items-center gap-4">
                {i > 0 && <span className="hidden sm:inline text-gray-700">·</span>}
                <span>
                  <span className="text-white">{stat.value}</span>{" "}
                  {stat.label}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Spacer for 3D on desktop */}
        <div className="hidden md:block flex-1 min-h-[200px]" />
      </div>

      {/* Desktop-only bottom panels */}
      <div className="hidden md:flex absolute bottom-8 left-8 right-8 justify-between items-end pointer-events-auto z-10">
        <div className="flex flex-col gap-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              {...cursor}
              className={`flex items-center gap-2 border px-3 py-2 rounded-full transition-colors cursor-none ${
                isSettingsOpen
                  ? "bg-white/10 border-white/40"
                  : "bg-black/50 border-white/10 hover:bg-white/5"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-[9px] text-gray-300">Model</span>
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-3 p-5 bg-[var(--bg-primary)]/95 border border-white/10 rounded-2xl w-64 shadow-2xl backdrop-blur-xl"
                >
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                    Configuration
                  </h3>
                  <div className="mb-4">
                    <label className="text-[9px] uppercase text-gray-500 block mb-2">
                      Glass Color
                    </label>
                    <input
                      type="color"
                      value={modelSettings.color}
                      onChange={(e) =>
                        onModelSettingsChange({
                          ...modelSettings,
                          color: e.target.value,
                        })
                      }
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-[9px] uppercase text-gray-500 flex justify-between mb-2">
                      <span>Scale</span>
                      <span className="text-[var(--accent)]">
                        {modelSettings.scale.toFixed(1)}x
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={modelSettings.scale}
                      onChange={(e) =>
                        onModelSettingsChange({
                          ...modelSettings,
                          scale: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-gray-500 flex justify-between mb-2">
                      <span>Speed</span>
                      <span className="text-[var(--accent)]">
                        {modelSettings.speed.toFixed(1)}x
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={modelSettings.speed}
                      onChange={(e) =>
                        onModelSettingsChange({
                          ...modelSettings,
                          speed: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className="w-64 border-l border-white/10 pl-4 cursor-none"
          {...cursor}
        >
          <h4 className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-3">
            GitHub / YSMLB
          </h4>
          <div className="relative h-20 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={newsIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <span className="text-[9px] text-[var(--accent)] tracking-widest">
                  {githubProjects[newsIndex]?.date}
                </span>
                {githubProjects[newsIndex]?.url ? (
                  <a
                    href={githubProjects[newsIndex].url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-white uppercase tracking-wider font-bold truncate hover:text-[var(--accent)] transition-colors"
                  >
                    {githubProjects[newsIndex]?.title}
                  </a>
                ) : (
                  <span className="block text-xs text-white uppercase tracking-wider font-bold truncate">
                    {githubProjects[newsIndex]?.title}
                  </span>
                )}
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                  {githubProjects[newsIndex]?.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
