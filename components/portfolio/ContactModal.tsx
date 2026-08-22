"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/portfolio/constants";
import { useCursorHandlers } from "./CustomCursor";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsCursorHovered: (v: boolean) => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  setIsCursorHovered,
}: ContactModalProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto cursor-auto md:cursor-none px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[var(--bg-primary)] border border-white/10 p-8 md:p-12 rounded-2xl max-w-sm md:max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              {...cursor}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-500 hover:text-white font-mono text-[10px] md:text-xs uppercase cursor-auto md:cursor-none"
            >
              Close [x]
            </button>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
              Связаться
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Выберите удобный способ связи
            </p>
            <div className="flex flex-col gap-6 font-mono text-xs md:text-sm">
              <a
                href={`mailto:${CONTACT.email}?subject=Contact Request`}
                {...cursor}
                className="group block cursor-auto md:cursor-none"
              >
                <p className="text-gray-500 mb-1 transition-colors group-hover:text-[var(--accent)]">
                  Email
                </p>
                <p className="text-white transition-colors group-hover:text-gray-300 break-words">
                  {CONTACT.email}
                </p>
              </a>
              <a
                href={CONTACT.telegram}
                target="_blank"
                rel="noreferrer"
                {...cursor}
                className="group block cursor-auto md:cursor-none"
              >
                <p className="text-gray-500 mb-1 transition-colors group-hover:text-[var(--accent)]">
                  Telegram
                </p>
                <p className="text-white transition-colors group-hover:text-gray-300">
                  {CONTACT.telegramHandle}
                </p>
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                {...cursor}
                className="group block cursor-auto md:cursor-none"
              >
                <p className="text-gray-500 mb-1 transition-colors group-hover:text-[var(--accent)]">
                  GitHub
                </p>
                <p className="text-white transition-colors group-hover:text-gray-300">
                  {CONTACT.githubHandle}
                </p>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
