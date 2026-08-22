"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { portfolioProjects } from "@/data/projects";
import { useCursorHandlers } from "./CustomCursor";

interface ProjectsSectionProps {
  setIsCursorHovered: (v: boolean) => void;
}

export default function ProjectsSection({
  setIsCursorHovered,
}: ProjectsSectionProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);

  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-primary)]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-16"
        >
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
            02 / Selected Works
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
            Избранные проекты
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {portfolioProjects.map((project, index) => {
            const isClickable = project.link && project.link !== "#";

            const cardContent = (
              <>
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${project.accent}, transparent 70%)`,
                  }}
                />
                <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-8">
                  <div>
                    <span className="font-mono text-[10px] text-gray-600 mb-3 block">
                      0{project.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-medium text-white group-hover:text-[var(--accent)] transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light uppercase tracking-widest mb-4">
                      {project.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border border-white/10 rounded text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-[var(--accent)] transition-colors"
                      style={{ color: isClickable ? undefined : "inherit" }}
                    >
                      {isClickable ? "View Case →" : "In Progress"}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all duration-300"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-500 group-hover:text-[var(--accent)] transition-colors"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            );

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {isClickable ? (
                  <Link
                    href={project.link}
                    {...cursor}
                    className="group relative block aspect-[4/3] md:aspect-[16/10] rounded-2xl border border-white/10 bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--accent)]/50 hover:scale-[1.02] transition-all duration-500 cursor-auto md:cursor-none"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div className="group relative block aspect-[4/3] md:aspect-[16/10] rounded-2xl border border-white/10 bg-[var(--bg-surface)] overflow-hidden opacity-50">
                    {cardContent}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
